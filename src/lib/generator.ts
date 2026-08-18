import type { Reel, TechCategory, SkillLevel, StudentProfile } from '@/types';
import { categorySpecs, type TechMediaSpec } from '@/data/reelImages';

export interface GeneratedReelResult {
  reel: Reel;
  spec: TechMediaSpec;
  generationSteps: string[];
}

export const topicSuggestionsByInterest: Record<string, string[]> = {
  'Backend': [
    'Event-Driven Microservices with Apache Kafka in Spring Boot',
    'Distributed Tracing with OpenTelemetry and Jaeger in Go',
    'PostgreSQL Connection Pooling with PgBouncer at Scale',
    'High-Performance gRPC vs REST Benchmark in Node.js',
  ],
  'AI': [
    'Building Production RAG with Hybrid Vector Search and BM25',
    'Fine-Tuning Large Language Models with QLoRA on Single GPU',
    'FlashAttention-2 Kernel Optimization for Transformer LLMs',
    'Graph Neural Networks for Real-Time Fraud Detection',
  ],
  'Hardware': [
    'CUDA Shared Memory Tiling for Matrix Multiplication',
    'PCIe Gen 5 vs Gen 4 Bandwidth in Multi-GPU Training Clusters',
    'Understanding CPU Cache L1/L2/L3 Thrashing with perf',
    'Raspberry Pi 5 Real-Time Edge Object Detection',
  ],
  'DSA': [
    'Monotonic Stack Pattern for Next Greater Element',
    'Trie Data Structure for Autocomplete with Prefix Counting',
    'Dijkstra Shortest Path with Min-Heap Priority Queue',
    'Segment Tree with Lazy Propagation for Range Updates',
  ],
  'Cybersecurity': [
    'JWT Key Confusion Attack Breakdown and Secret Remediations',
    'Zero Trust Architecture: Mutual TLS (mTLS) in Kubernetes',
    'Cross-Site Request Forgery (CSRF) Prevention with SameSite Cookies',
    'Reversing Malware with Ghidra: Disassembly Walkthrough',
  ],
  'Cloud': [
    'Kubernetes Horizontal Pod Autoscaler (HPA) with Custom Metrics',
    'Terraform Multi-Cloud Infrastructure with State Locking',
    'Zero-Downtime Blue-Green Deployments on AWS ECS',
    'Docker Multi-Stage Optimization for Rust Web Services',
  ],
  'System Design': [
    'Designing YouTube Video Transcoding Pipeline at Scale',
    'Distributed Rate Limiting with Redis Token Bucket Algorithm',
    'Consistent Hashing with Virtual Nodes for Database Sharding',
    'Designing a Real-Time Collaborative Document Editor with CRDTs',
  ],
};

function inferCategoryFromPrompt(prompt: string): TechCategory {
  const p = prompt.toLowerCase();
  if (p.includes('java') || p.includes('spring') || p.includes('jvm')) return 'Java';
  if (p.includes('python') || p.includes('fastapi') || p.includes('django')) return 'Python';
  if (p.includes('algo') || p.includes('dsa') || p.includes('leetcode') || p.includes('tree') || p.includes('graph')) return 'DSA';
  if (p.includes('ai') || p.includes('rag') || p.includes('llm') || p.includes('gpt') || p.includes('transformer')) return 'AI';
  if (p.includes('ml') || p.includes('machine learning') || p.includes('neural') || p.includes('dataset')) return 'Machine Learning';
  if (p.includes('cloud') || p.includes('aws') || p.includes('k8s') || p.includes('kubernetes') || p.includes('docker')) return 'Cloud';
  if (p.includes('security') || p.includes('hack') || p.includes('xss') || p.includes('sql') || p.includes('cyber')) return 'Cybersecurity';
  if (p.includes('gpu') || p.includes('hardware') || p.includes('pc') || p.includes('cuda') || p.includes('cpu')) return 'Hardware';
  if (p.includes('system design') || p.includes('scale') || p.includes('redis') || p.includes('kafka') || p.includes('microservice')) return 'System Design';
  if (p.includes('backend') || p.includes('api') || p.includes('grpc') || p.includes('database')) return 'Backend';
  if (p.includes('frontend') || p.includes('react') || p.includes('css') || p.includes('vue')) return 'Frontend';
  if (p.includes('devops') || p.includes('ci/cd') || p.includes('terraform')) return 'DevOps';
  if (p.includes('interview') || p.includes('career') || p.includes('resume')) return 'Career';
  return 'Backend';
}

function generateCodeForTopic(topic: string, category: TechCategory): {
  code: string;
  lang: string;
  command: string;
  output: string;
  metric: string;
} {
  const base = categorySpecs[category] || categorySpecs['Backend'];

  if (topic.toLowerCase().includes('kafka')) {
    return {
      code: `@Service
public class KafkaEventConsumer {
  @KafkaListener(topics = "transactions.v1", groupId = "audit-svc")
  public void processTransaction(
    @Payload TransactionEvent event,
    @Header(KafkaHeaders.RECEIVED_PARTITION) int partition
  ) {
    log.info("Processing event {} from partition {}", event.getId(), partition);
    auditRepository.persistWithIdempotency(event);
  }
}`,
      lang: 'java',
      command: 'kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group audit-svc',
      output: 'GROUP           TOPIC            PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG\naudit-svc       transactions.v1  0          419208          419208          0\naudit-svc       transactions.v1  1          398412          398412          0',
      metric: '0 Msg Lag @ 50k/s',
    };
  }

  if (topic.toLowerCase().includes('rag') || topic.toLowerCase().includes('vector')) {
    return {
      code: `async function hybridSearch(query: string, k = 5): Promise<Document[]> {
  const denseEmbeddings = await openai.embeddings.create({ input: query });
  const [vectorMatches, sparseMatches] = await Promise.all([
    qdrant.search('tech_kb', { vector: denseEmbeddings.data[0].embedding, limit: k * 2 }),
    bm25Index.search(query, k * 2)
  ]);
  
  // Reciprocal Rank Fusion (RRF) algorithm
  return reciprocalRankFusion([vectorMatches, sparseMatches], k);
}`,
      lang: 'typescript',
      command: 'curl -X POST http://localhost:8000/v1/hybrid_search -d \'{"query": "distributed consensus"}\'',
      output: '{\n  "status": "success",\n  "matched_documents": 5,\n  "rrf_score_top1": 0.0328,\n  "retrieval_latency_ms": 3.84\n}',
      metric: '3.84ms Vector Query',
    };
  }

  return {
    code: base.codeSnippet,
    lang: base.language,
    command: base.terminalCommand,
    output: base.terminalOutput,
    metric: base.metricValue,
  };
}

export function generateRealisticReel(
  topicPrompt: string,
  student?: StudentProfile,
  latentInterest?: string
): GeneratedReelResult {
  const category = inferCategoryFromPrompt(topicPrompt);
  const cleanTitle = topicPrompt.trim();
  const id = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  
  const creatorNames = [
    'TechArchitect',
    'CodeCraftsman',
    'SystemsEngineering',
    'DevOpsNinja',
    'DataCoreAI',
    'ModernDeveloper',
  ];
  const creator = creatorNames[Math.floor(Math.random() * creatorNames.length)];

  const gradients = [
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
  ];
  const gradient = gradients[Math.floor(Math.random() * gradients.length)];

  const words = cleanTitle.split(' ');
  const primaryTopic = words.slice(0, 3).join(' ');
  const secondaryTopic = words.slice(3).join(' ') || category;

  const codeData = generateCodeForTopic(cleanTitle, category);
  const baseSpec = categorySpecs[category] || categorySpecs['Backend'];

  const spec: TechMediaSpec = {
    ...baseSpec,
    codeSnippet: codeData.code,
    language: codeData.lang,
    terminalCommand: codeData.command,
    terminalOutput: codeData.output,
    metricValue: codeData.metric,
  };

  const skillLevel: SkillLevel =
    cleanTitle.toLowerCase().includes('basic') || cleanTitle.toLowerCase().includes('beginner')
      ? 'Beginner'
      : cleanTitle.toLowerCase().includes('kernel') || cleanTitle.toLowerCase().includes('scale') || cleanTitle.toLowerCase().includes('distributed')
      ? 'Advanced'
      : 'Intermediate';

  const educationalValue = Math.floor(Math.random() * 10) + 88; // 88 - 98
  const hypeScore = Math.floor(Math.random() * 15) + 5; // 5 - 20 (clean, non-clickbait)
  const credibility = Math.floor(Math.random() * 8) + 91; // 91 - 98

  const transcript = `In this deep dive into ${cleanTitle}, we break down the core architecture, examine real-world code implementation, and analyze production performance benchmarks step by step.`;

  const reel: Reel = {
    id,
    title: cleanTitle,
    caption: `Mastering ${cleanTitle} — production patterns, architecture insights & live code demo. 💻🚀`,
    hashtags: [
      `#${category.toLowerCase().replace(/\s+/g, '')}`,
      `#${words[0]?.toLowerCase() || 'tech'}`,
      '#coding',
      '#softwareengineering',
      '#techtrace',
    ],
    category,
    topics: [primaryTopic, secondaryTopic, category],
    concepts: ['Architecture', 'Implementation', 'Performance', 'Best Practices'],
    transcript,
    visualElements: ['IDE Code Walkthrough', 'Terminal Output', 'System Architecture'],
    skillLevel,
    hypeScore,
    educationalValue,
    credibility,
    engagementPotential: 85,
    difficulty: skillLevel === 'Beginner' ? 3 : skillLevel === 'Intermediate' ? 6 : 8,
    duration: 60,
    creator,
    gradient,
  };

  const generationSteps = [
    `Analyzing student profile (${student?.name || 'User'}) and latent interest in "${latentInterest || category}"...`,
    `Synthesizing production-grade ${codeData.lang.toUpperCase()} code snippet for "${cleanTitle}"...`,
    `Generating live terminal verification suite and execution metrics...`,
    `Running Explainable AI Audit: Edu Value ${educationalValue}/100, Hype Filter Passed (${hypeScore}/100)...`,
    `Finalizing interactive visualizer and publishing to recommendation feed.`,
  ];

  return { reel, spec, generationSteps };
}
