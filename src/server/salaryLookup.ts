import fs from 'fs';
import path from 'path';
import { SalaryCompanyRecord, SalaryLookupResult } from '../types.js';

const DATA_FILE = path.resolve(process.cwd(), 'salary_data.json');

const SPELLING_VARIANTS: Record<string, string> = {
  ø: 'o',
  æ: 'ae',
  å: 'aa',
  ö: 'o',
  ä: 'ae',
  ü: 'u',
};

const STRIP_PATTERNS = [
  /\ba\/s\b/gi,
  /\baps\b/gi,
  /\bi\/s\b/gi,
  /\bp\/s\b/gi,
  /\bk\/s\b/gi,
  /\bivs\b/gi,
  /\bamba\b/gi,
  /\ba\.m\.b\.a\.?\b/gi,
  /\(vg\)/gi,
  /\(.*?\)/gi,
  /\bdanmark\b/gi,
  /\bdenmark\b/gi,
  /\bscandinavia\b/gi,
  /\bnordic\b/gi,
  /\bgroup\b/gi,
  /\bholding\b/gi,
  /,\s*.*$/gi,
];

export function anglicize(s: string): string {
  let res = s.toLowerCase();
  for (const [danish, english] of Object.entries(SPELLING_VARIANTS)) {
    res = res.replaceAll(danish, english);
  }
  return res;
}

export function normalize(s: string): string {
  let str = s.toLowerCase().trim();
  for (const pat of STRIP_PATTERNS) {
    str = str.replace(pat, '');
  }
  str = str.replace(/[^a-zæøåöäü0-9]/gi, '');
  return str.trim();
}

export function extractCoreWords(s: string): string[] {
  let str = s.toLowerCase();
  for (const pat of STRIP_PATTERNS) {
    str = str.replace(pat, '');
  }
  const words = str.match(/[a-zæøåöäü0-9]+/gi) || [];
  return words.filter((w) => w.length > 1);
}

export function matchScore(query: string, entryName: string): number {
  const qNorm = normalize(query);
  const nNorm = normalize(entryName);

  if (!qNorm || !nNorm) return 0;
  if (qNorm === nNorm) return 100;

  const qAng = anglicize(qNorm);
  const nAng = anglicize(nNorm);

  const qWords = extractCoreWords(query);
  const nWords = extractCoreWords(entryName);
  const qWordsSet = new Set(qWords);
  const nWordsSet = new Set(nWords);

  const qWordsAngSet = new Set(qWords.map(anglicize));
  const nWordsAngSet = new Set(nWords.map(anglicize));

  if (nNorm.includes(qNorm)) {
    const ratio = qNorm.length / nNorm.length;
    if (qNorm.length <= 4 && ratio < 0.5) {
      const hasWordOverlap = [...qWordsSet].some((w) => nWordsSet.has(w));
      if (hasWordOverlap) return 80 + Math.floor(ratio * 10);
    } else {
      return 80 + Math.floor(ratio * 10);
    }
  }

  if (qNorm.includes(nNorm)) {
    const ratio = nNorm.length / qNorm.length;
    if (nNorm.length <= 4 && ratio < 0.5) {
      // small ratio
    } else {
      return 80 + Math.floor(ratio * 10);
    }
  }

  if (qAng === nAng) return 85;

  if (nAng.includes(qAng) || qAng.includes(nAng)) {
    const shorter = Math.min(qAng.length, nAng.length);
    const longer = Math.max(qAng.length, nAng.length);
    if (shorter <= 4 && shorter / longer < 0.5) {
      const hasWordOverlap = [...qWordsAngSet].some((w) => nWordsAngSet.has(w));
      if (hasWordOverlap) return 75;
    } else {
      return 75;
    }
  }

  if (qWordsSet.size === 0 || nWordsSet.size === 0) return 0;

  const overlapWords = [...qWordsSet].filter((w) => nWordsSet.has(w));
  let overlapCount = overlapWords.length;

  if (overlapCount === 0) {
    const angOverlap = [...qWordsAngSet].filter((w) => nWordsAngSet.has(w));
    overlapCount = angOverlap.length;
  }

  if (overlapCount > 0) {
    if (qWordsSet.size === 1) {
      const qWord = [...qWordsSet][0];
      if (nWordsSet.has(qWord) || nWordsAngSet.has(anglicize(qWord))) {
        return 70;
      }
      return 0;
    }
    const coverage = overlapCount / qWordsSet.size;
    return Math.floor(30 + coverage * 40);
  }

  return 0;
}

export function loadSalaryData(): { metadata: any; companies: SalaryCompanyRecord[] } {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read salary_data.json:', err);
  }
  return {
    metadata: {
      source: 'Default Tech Benchmark',
      index_baseline: 100,
      index_label: 'Index',
      baseline_description: 'Index 100 = median salary benchmark',
    },
    companies: [],
  };
}

export function searchCompanySalary(query: string, city?: string): SalaryLookupResult[] {
  const data = loadSalaryData();
  const baseline = data.metadata?.index_baseline ?? 100;

  const scored: Array<{ score: number; entry: SalaryCompanyRecord }> = [];

  for (const entry of data.companies) {
    if (city) {
      const cityLower = city.toLowerCase();
      const entryCity = (entry.city || '').toLowerCase();
      if (!entryCity.includes(cityLower) && !anglicize(entryCity).includes(anglicize(cityLower))) {
        continue;
      }
    }

    const score = matchScore(query, entry.company);
    if (score >= 30) {
      scored.push({ score, entry });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.entry.company.localeCompare(b.entry.company));

  return scored.map(({ score, entry }) => {
    let allEmpIndex: number | undefined;
    if (entry.categories && entry.categories.all_employees?.index) {
      const idx = entry.categories.all_employees.index;
      if (typeof idx === 'number') allEmpIndex = idx;
      else allEmpIndex = parseFloat(idx) || undefined;
    }
    const diff = allEmpIndex !== undefined ? Math.round(((allEmpIndex - baseline) / baseline) * 1000) / 10 : undefined;

    return {
      score,
      company: entry.company,
      city: entry.city,
      categories: entry.categories || {},
      diffFromBaseline: diff,
    };
  });
}

export function saveSalaryData(data: { metadata: any; companies: SalaryCompanyRecord[] }): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
