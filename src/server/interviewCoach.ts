import { CandidateProfile, InterviewPrepPackage, InterviewQuestion } from '../types.js';

export function generateInterviewPrep(
  role: string,
  company: string,
  profile: CandidateProfile
): InterviewPrepPackage {
  const topExp = profile.experience[0];

  const behavioralQuestions: InterviewQuestion[] = [
    {
      question: `Tell me about a time when an architectural choice you made faced resistance or unexpected production constraints. How did you resolve it?`,
      type: 'behavioral',
      suggestedStarAnswer: {
        situation: `While designing a real-time event pipeline at ${topExp.company}, part of the team wanted to stick to synchronous HTTP polling, whereas throughput demanded event streaming.`,
        task: `I needed to deliver a reliable system capable of handling 10x traffic spikes without alienating team members or introducing undue operational burden.`,
        action: `I built a quick proof-of-concept benchmark demonstrating latency under load, hosted a technical walkthrough to demystify message queue error recovery, and pair-programmed the initial integration.`,
        result: `The team embraced the architecture, production latency dropped by 55%, and we suffered zero dropped messages during subsequent Black Friday spikes.`,
      },
      talkingTips: [
        'Focus on consensus building and measurable data rather than purely technical dogmatism.',
        'Explicitly mention post-launch monitoring and observability.',
      ],
    },
    {
      question: `Describe a situation where a critical bug slipped into production. How did you react?`,
      type: 'behavioral',
      suggestedStarAnswer: {
        situation: `A minor edge-case in an API serializer caused intermittent 500 errors for Scandinavian users with special characters (æ, ø, å).`,
        task: `Mitigate immediate user impact, diagnose root cause, and implement permanent systemic safeguards.`,
        action: `Immediately rolled back to the previous stable release artifact within 4 minutes. Then wrote reproducing unit tests, fixed character encoding normalizers, and added automated end-to-end integration tests to CI.`,
        result: `Conducted a blameless post-mortem, shared learnings across engineering, and instituted charset test fixtures across all microservices.`,
      },
      talkingTips: [
        'Emphasize emotional composure, swift user-first mitigation, and blameless retrospective culture.',
      ],
    },
    {
      question: `Why ${company}, and why now?`,
      type: 'culture',
      suggestedStarAnswer: {
        situation: `I have been following ${company}'s growth and product announcements in the Danish ecosystem.`,
        task: `Demonstrate genuine alignment between my technical interests and ${company}'s business horizon.`,
        action: `Highlight how my background in distributed systems and high-usability frontend interfaces directly matches the engineering roadmap you are scaling.`,
        result: `A strong mutual fit where I can make immediate contributions to core squads from day one.`,
      },
      talkingTips: [
        'Reference a specific recent feature, initiative, or public tech blog post by the company.',
        'Tie your genuine passion to solving their real technical bottleneck.',
      ],
    },
  ];

  const technicalQuestions: InterviewQuestion[] = [
    {
      question: `How would you architect a modern web application frontend for maximum resilience and sub-second Core Web Vitals?`,
      type: 'technical',
      suggestedStarAnswer: {
        situation: `Modern Single Page Applications often suffer from oversized JavaScript bundles and hydration waterfalls.`,
        task: `Deliver fast First Contentful Paint (FCP) and Largest Contentful Paint (LCP) across both mobile and desktop.`,
        action: `Leverage route-based code splitting, server-side rendering (SSR) or streaming SSR, aggressive HTTP cache headers for static immutable chunks, optimized font loading, and deferring non-critical telemetry.`,
        result: `Achieved 95+ Google Lighthouse scores and improved user engagement by 20% in prior roles.`,
      },
      talkingTips: [
        'Mention cumulative layout shift (CLS) prevention and image dimension attributes.',
        'Discuss bundle analyzer tooling (Vite/Rollup visualizer).',
      ],
    },
    {
      question: `When designing REST vs GraphQL vs Event-driven APIs, what heuristics guide your decision?`,
      type: 'technical',
      suggestedStarAnswer: {
        situation: `Selecting the right communication protocol depends on client diversity, network constraints, and coupling tolerance.`,
        task: `Establish an architectural standard that supports rapid frontend iteration without overloading backend databases.`,
        action: `Use REST with OpenAPI for clean public integrations, GraphQL for rich client applications needing flexible schema querying, and Kafka/event-streaming for asynchronous decoupling.`,
        result: `Prevented over-fetching while maintaining clean domain boundaries across backend services.`,
      },
      talkingTips: [
        'Talk about caching ergonomics (REST HTTP caching vs GraphQL persisted queries).',
      ],
    },
  ];

  const smartQuestionsToAsk = [
    `How does the engineering team currently balance technical debt repayment with new product feature velocity?`,
    `What does a typical release lifecycle look like from PR merge to production rollout, and how automated is canary testing?`,
    `What would success look like for someone stepping into this role during the first 90 days?`,
    `How are cross-team architectural decisions decided and documented (e.g. RFCs, Architecture Guild)?`,
    `How has the team adapted its workflows around modern AI-assisted engineering tools?`,
  ];

  const companyBackgroundTalkingPoints = [
    `${company} is recognized in Denmark for engineering quality and stable product iteration.`,
    `Emphasize familiarity with Danish workplace culture: flat hierarchies, proactive autonomy, direct feedback, and high trust.`,
    `Mention your collaborative approach to code reviews and cross-squad knowledge sharing.`,
  ];

  const upskillRoadmap = [
    {
      skill: 'Distributed Event Streaming (Kafka / NATS)',
      priority: 'High' as const,
      recommendation: 'Review consumer group rebalancing, idempotent message producers, and dead-letter queue architectures.',
    },
    {
      skill: 'Kubernetes & Helm Deployment Patterns',
      priority: 'Medium' as const,
      recommendation: 'Deepen knowledge of ingress routing, horizontal pod autoscalers (HPA), and zero-downtime rolling updates.',
    },
    {
      skill: 'LLM Evaluation & Guardrails',
      priority: 'Medium' as const,
      recommendation: 'Explore structured JSON outputs, semantic caching, and latency optimization for agentic pipelines.',
    },
  ];

  return {
    role,
    company,
    behavioralQuestions,
    technicalQuestions,
    smartQuestionsToAsk,
    companyBackgroundTalkingPoints,
    upskillRoadmap,
  };
}
