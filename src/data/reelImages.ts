import type { TechCategory } from '@/types';

export interface TechMediaSpec {
  video: string;
  poster: string;
  codeSnippet: string;
  language: string;
  terminalCommand: string;
  terminalOutput: string;
  metricLabel: string;
  metricValue: string;
  accentColor: string;
}

// Verified high-performance tech video backgrounds (CORS-friendly, reliable WebM/MP4)
const techVideoLibrary = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
];

// Authentic curated HD tech poster images
const categoryPosters: Record<TechCategory, string[]> = {
  Java: [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
  ],
  Python: [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80',
  ],
  DSA: [
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  ],
  AI: [
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  ],
  'Machine Learning': [
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&auto=format&fit=crop&q=80',
  ],
  Cloud: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
  ],
  Cybersecurity: [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
  ],
  Hardware: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
  ],
  Career: [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80',
  ],
  'System Design': [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
  ],
  Backend: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  ],
  Frontend: [
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
  ],
  DevOps: [
    'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  ],
  Database: [
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
  ],
  'Programming Meme': [
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  ],
  'Tech News': [
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=80',
  ],
  Entertainment: [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
  ],
  Gaming: [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
  ],
};

// Realistic Code, Terminal, and Live Metrics specs per category
export const categorySpecs: Record<TechCategory, TechMediaSpec> = {
  Java: {
    video: techVideoLibrary[0],
    poster: categoryPosters.Java[0],
    language: 'java',
    codeSnippet: `@RestController
@RequestMapping("/api/v1/stream")
public class EventController {
  @Autowired
  private StreamService streamService;

  @PostMapping("/publish")
  public ResponseEntity<Ack> emit(@Valid @RequestBody EventPayload payload) {
    var traceId = streamService.dispatchAsync(payload);
    return ResponseEntity.ok(new Ack(traceId, Status.COMMITTED));
  }
}`,
    terminalCommand: 'mvn spring-boot:run -Dspring-boot.run.profiles=prod',
    terminalOutput: '[INFO] Started Application in 1.482 seconds (JVM running for 1.94)\n[INFO] HikariCP pool initialized: 20 active connections',
    metricLabel: 'JVM Heap Allocation',
    metricValue: '412MB / 2048MB',
    accentColor: '#f97316',
  },
  Python: {
    video: techVideoLibrary[1],
    poster: categoryPosters.Python[0],
    language: 'python',
    codeSnippet: `from fastapi import FastAPI, Depends, BackgroundTasks
from pydantic import BaseModel, Field

app = FastAPI(title="Distributed AI Gateway")

class InferenceRequest(BaseModel):
    prompt: str = Field(..., min_length=3)
    temperature: float = 0.7

@app.post("/v1/predict")
async def generate(req: InferenceRequest, bg: BackgroundTasks):
    tensor = await model_pool.infer_async(req.prompt)
    bg.add_task(log_telemetry, req, tensor.latency_ms)
    return {"output": tensor.decoded, "tokens_sec": 84.6}`,
    terminalCommand: 'uvicorn gateway.main:app --workers 4 --port 8000',
    terminalOutput: 'INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)\nINFO:     Async Worker #1 [PID 4821] initialized with PyTorch 2.3.0+cu121',
    metricLabel: 'Inference Throughput',
    metricValue: '124 req/sec',
    accentColor: '#38bdf8',
  },
  DSA: {
    video: techVideoLibrary[2],
    poster: categoryPosters.DSA[0],
    language: 'typescript',
    codeSnippet: `// Optimal Binary Search on Rotated Sorted Array - O(log N)
function searchRotated(nums: number[], target: number): number {
  let [left, right] = [0, nums.length - 1];
  while (left <= right) {
    const mid = (left + right) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
    terminalCommand: 'npm test -- --filter=algorithms.rotated_search',
    terminalOutput: 'PASS src/algo/rotatedSearch.test.ts (24 tests passed, 0 failed)\nTime Complexity: O(log N) | Space: O(1) auxiliary',
    metricLabel: 'Time Complexity',
    metricValue: 'O(log N) Verified',
    accentColor: '#a855f7',
  },
  AI: {
    video: techVideoLibrary[3],
    poster: categoryPosters.AI[0],
    language: 'python',
    codeSnippet: `# Scaled Dot-Product Attention: Softmax(Q * K^T / sqrt(d_k)) * V
import torch
import torch.nn.functional as F

def self_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V), weights`,
    terminalCommand: 'python -m torch.distributed.run --nproc_per_node=8 train_lora.py',
    terminalOutput: 'Epoch 1/5 [Step 4200/50000] Loss: 0.1842 | Perplexity: 1.202 | VRAM: 18.4GB / 24GB\nAttention cache hit rate: 99.4%',
    metricLabel: 'GPU Memory Bandwidth',
    metricValue: '864 GB/s (A100)',
    accentColor: '#06b6d4',
  },
  'Machine Learning': {
    video: techVideoLibrary[4],
    poster: categoryPosters['Machine Learning'][0],
    language: 'python',
    codeSnippet: `import torch.nn as nn

class ResidualBlock(nn.Module):
    def __init__(self, channels: int):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(channels)
        self.relu = nn.GELU()
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x):
        return self.relu(x + self.bn2(self.conv2(self.relu(self.bn1(self.conv1(x))))))`,
    terminalCommand: 'python eval_pipeline.py --dataset=val_2024 --metric=f1',
    terminalOutput: 'Validation F1-Score: 0.9482 | Precision: 0.961 | Recall: 0.936\nLatency per batch: 1.84ms',
    metricLabel: 'Model F1 Accuracy',
    metricValue: '94.82% Top-1',
    accentColor: '#10b981',
  },
  Cloud: {
    video: techVideoLibrary[5],
    poster: categoryPosters.Cloud[0],
    language: 'dockerfile',
    codeSnippet: `# Multi-stage lightweight distroless production build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server .

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /app/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]`,
    terminalCommand: 'docker build --target=production -t cloud-microservice:v2 .',
    terminalOutput: 'Step 8/8 : Successfully tagged cloud-microservice:v2 (Image size: 14.8MB)\nCluster autoscaler healthy: 12 nodes ready across 3 AZs',
    metricLabel: 'Container Size',
    metricValue: '14.8 MB Distroless',
    accentColor: '#0ea5e9',
  },
  Cybersecurity: {
    video: techVideoLibrary[1],
    poster: categoryPosters.Cybersecurity[0],
    language: 'sql',
    codeSnippet: `-- VULNERABLE SQL: "SELECT * FROM users WHERE id = '" + userInput + "'"
-- ATTACK: ' OR '1'='1' -- 

-- SECURE REMEDIATION: Parameterized Prepared Statement
PREPARE SafeUserQuery (UUID) AS
SELECT id, email, role_id, mfa_enabled, created_at 
FROM accounts.users 
WHERE id = $1 AND deleted_at IS NULL;

EXECUTE SafeUserQuery('e3b0c442-98fc-1c14-9afb-4c8996fb9242');`,
    terminalCommand: 'nmap -sV -sC -p 443,8080,5432 sec-target.prod.net',
    terminalOutput: 'Nmap scan report for sec-target.prod.net\nAll 3 scanned ports in SYN-ACK state. WAF: Cloudflare (Attack blocked: 0 vulnerabilities found)',
    metricLabel: 'OWASP Security Score',
    metricValue: 'A+ (0 Criticals)',
    accentColor: '#ef4444',
  },
  Hardware: {
    video: techVideoLibrary[0],
    poster: categoryPosters.Hardware[0],
    language: 'cpp',
    codeSnippet: `// CUDA Matrix Multiplication Kernel with Shared Memory Tiling
__global__ void matrixMulKernel(float* C, const float* A, const float* B, int N) {
    __shared__ float As[BLOCK_SIZE][BLOCK_SIZE];
    __shared__ float Bs[BLOCK_SIZE][BLOCK_SIZE];
    int bx = blockIdx.x, by = blockIdx.y;
    int tx = threadIdx.x, ty = threadIdx.y;
    int row = by * BLOCK_SIZE + ty;
    int col = bx * BLOCK_SIZE + tx;
    float sum = 0.0f;
    for (int sub = 0; sub < N / BLOCK_SIZE; ++sub) {
        As[ty][tx] = A[row * N + sub * BLOCK_SIZE + tx];
        Bs[ty][tx] = B[(sub * BLOCK_SIZE + ty) * N + col];
        __syncthreads();
        for (int k = 0; k < BLOCK_SIZE; ++k) sum += As[ty][k] * Bs[k][tx];
        __syncthreads();
    }
    if (row < N && col < N) C[row * N + col] = sum;
}`,
    terminalCommand: 'nvidia-smi --query-gpu=utilization.gpu,temperature.gpu,memory.used --format=csv -l 1',
    terminalOutput: 'GPU Load: 98% | Core Temp: 62°C | Tensor Cores: Active (FP16)\nVRAM Occupancy: 21.8 GB / 24.0 GB',
    metricLabel: 'Compute FLOPs',
    metricValue: '312 TFLOPs (FP16)',
    accentColor: '#6366f1',
  },
  Career: {
    video: techVideoLibrary[2],
    poster: categoryPosters.Career[0],
    language: 'yaml',
    codeSnippet: `# Career Roadmap: Senior Software Engineer (L5+)
KeyMilestones:
  DistributedSystems:
    - ConsensusProtocols (Raft, Paxos)
    - HighThroughputQueues (Kafka, Pulsar)
    - DatabaseInternals (LSM-Trees, WAL, B-Trees)
  SystemDesign:
    - 99.999% SLA Architecture
    - Global multi-region active-active failover
  Leadership:
    - Technical design reviews & mentoring
    - Cross-team RFC authoring & delivery`,
    terminalCommand: 'gh pr review 1482 --approve -b "Clean architecture, benchmarks look solid!"',
    terminalOutput: 'Pull Request #1482 approved and merged into master\nCI/CD automated regression tests passed in 48s',
    metricLabel: 'Career Progression',
    metricValue: 'L5 Staff Track',
    accentColor: '#f59e0b',
  },
  'System Design': {
    video: techVideoLibrary[5],
    poster: categoryPosters['System Design'][0],
    language: 'typescript',
    codeSnippet: `// Distributed Cache-Aside with Sliding Window TTL & Stampede Protection
async function getCachedUserProfile(userId: string): Promise<UserProfile> {
  const cacheKey = \`user:profile:\${userId}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Acquire distributed mutex lock to prevent cache stampede
  const lock = await redis.lock(\`lock:\${cacheKey}\`, 2000);
  try {
    const user = await db.users.findUnique({ where: { id: userId } });
    await redis.setex(cacheKey, 3600, JSON.stringify(user));
    return user;
  } finally {
    await lock.release();
  }
}`,
    terminalCommand: 'k6 run --vus 5000 --duration 30s load_test_system.js',
    terminalOutput: 'HTTP reqs: 142,800/s | p95 Latency: 4.2ms | p99: 8.7ms\nError Rate: 0.00% across 5M simulated users',
    metricLabel: 'p99 API Latency',
    metricValue: '8.7ms @ 140k QPS',
    accentColor: '#3b82f6',
  },
  Backend: {
    video: techVideoLibrary[0],
    poster: categoryPosters.Backend[0],
    language: 'typescript',
    codeSnippet: `import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();
const userSchema = z.object({ email: z.string().email(), tier: z.enum(['free', 'pro']) });

router.post('/checkout', async (req: Request, res: Response) => {
  const data = userSchema.parse(req.body);
  const session = await stripe.checkout.sessions.create({
    customer_email: data.email,
    line_items: [{ price: PRICE_IDS[data.tier], quantity: 1 }],
    mode: 'subscription',
  });
  return res.status(201).json({ checkoutUrl: session.url });
});`,
    terminalCommand: 'wrk -t8 -c200 -d10s http://localhost:8080/health',
    terminalOutput: 'Running 10s test @ http://localhost:8080/health\n  8 threads and 200 connections\n  Requests/sec: 84120.40 | Transfer/sec: 14.8MB',
    metricLabel: 'Throughput',
    metricValue: '84k Req/s',
    accentColor: '#10b981',
  },
  Frontend: {
    video: techVideoLibrary[3],
    poster: categoryPosters.Frontend[0],
    language: 'tsx',
    codeSnippet: `import { useState, useTransition, useOptimistic } from 'react';

export function InteractiveVote({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    likes,
    (state, delta: number) => state + delta
  );
  const [isPending, startTransition] = useTransition();

  return (
    <button onClick={() => startTransition(async () => {
      setOptimisticLikes(1);
      await syncLikeToServer();
      setLikes(l => l + 1);
    })}>
      ❤️ {optimisticLikes} {isPending && '⚡'}
    </button>
  );
}`,
    terminalCommand: 'vite build --profile',
    terminalOutput: 'dist/index.html   0.48 kB\ndist/bundle.js   48.2 kB │ gzip: 14.1 kB\nFirst Contentful Paint (FCP): 0.32s | Lighthouse Score: 100/100',
    metricLabel: 'Bundle Gzip',
    metricValue: '14.1 kB Core',
    accentColor: '#06b6d4',
  },
  DevOps: {
    video: techVideoLibrary[5],
    poster: categoryPosters.DevOps[0],
    language: 'yaml',
    codeSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway-prod
  labels:
    tier: microservice
spec:
  replicas: 12
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: gateway
        image: registry.internal/gateway:v3.2.0
        resources:
          limits: { cpu: "2000m", memory: "1Gi" }
          requests: { cpu: "500m", memory: "256Mi" }`,
    terminalCommand: 'kubectl rollout status deployment/api-gateway-prod -n production',
    terminalOutput: 'deployment "api-gateway-prod" successfully rolled out (12/12 pods ready)\nZero downtime canary verified: 0 HTTP 5xx errors recorded',
    metricLabel: 'Pod Fleet Health',
    metricValue: '12/12 Active Pods',
    accentColor: '#8b5cf6',
  },
  Database: {
    video: techVideoLibrary[4],
    poster: categoryPosters.Database[0],
    language: 'sql',
    codeSnippet: `-- High-Performance B-Tree Composite Index with Partial Filter
CREATE INDEX CONCURRENTLY idx_orders_customer_created
ON sales.orders (customer_id, created_at DESC)
INCLUDE (total_amount, status)
WHERE status IN ('PAID', 'PROCESSING');

EXPLAIN ANALYZE
SELECT id, total_amount FROM sales.orders
WHERE customer_id = 'c90a8112' AND status = 'PAID'
ORDER BY created_at DESC LIMIT 20;`,
    terminalCommand: 'psql -U postgres -d production_db -c "SELECT pg_stat_statements_reset();"',
    terminalOutput: 'Query execution plan: Index Only Scan using idx_orders_customer_created\nPlanning Time: 0.082 ms | Execution Time: 0.141 ms',
    metricLabel: 'Index Execution',
    metricValue: '0.141ms Index Scan',
    accentColor: '#14b8a6',
  },
  'Programming Meme': {
    video: techVideoLibrary[0],
    poster: categoryPosters['Programming Meme'][0],
    language: 'javascript',
    codeSnippet: `// Friday 5:00 PM Deployment Checklist:
try {
  git.push('origin', 'master', { force: true });
  deployToProduction();
  console.log("It works on my machine! 🏃‍♂️💨");
} catch (prodCrash) {
  console.error("Blame the missing semicolon!");
  turnOffSlackNotifications();
}`,
    terminalCommand: 'git commit -m "fixed bug for good this time (attempt #14)"',
    terminalOutput: '[master 4a9f11c] fixed bug for good this time\n1 file changed, 1 insertion(+), 1 deletion(-)\nDeploying directly to production on Friday night...',
    metricLabel: 'Coffee to Code Ratio',
    metricValue: '99.9%',
    accentColor: '#eab308',
  },
  'Tech News': {
    video: techVideoLibrary[3],
    poster: categoryPosters['Tech News'][0],
    language: 'markdown',
    codeSnippet: `# Breaking: Next-Gen AI Models & Cloud Compute Releases
- Multi-head latent attention achieves 4x inference speedup
- Open-weights reasoning models surpass human coder benchmarks
- Distributed training cost drops 60% with FP8 mixed precision
- Real-time multimodal streaming API released globally`,
    terminalCommand: 'curl -s https://api.technews.internal/v1/feed | jq .trending[0:3]',
    terminalOutput: '1. "Open Source AI Surpasses Closed Frontier Models in Coding"\n2. "Kubernetes v1.31 Released with In-Place Pod Resize"\n3. "PostgreSQL 17 Benchmark Results Published"',
    metricLabel: 'Tech Radar Signal',
    metricValue: 'High Impact 2026',
    accentColor: '#6366f1',
  },
  Entertainment: {
    video: techVideoLibrary[0],
    poster: categoryPosters.Entertainment[0],
    language: 'markdown',
    codeSnippet: `# Tech Lounge & Entertainment
- Behind the scenes of tech creators
- Desk setups & ergonomic engineering
- Creative coding & generative art demonstrations`,
    terminalCommand: 'echo "Relax, code, and discover amazing tech!"',
    terminalOutput: 'Enjoying the curated tech stream! 🚀',
    metricLabel: 'Fun Factor',
    metricValue: '100%',
    accentColor: '#ec4899',
  },
  Gaming: {
    video: techVideoLibrary[2],
    poster: categoryPosters.Gaming[0],
    language: 'glsl',
    codeSnippet: `// Real-Time Ray-Traced Shadow Shader (Vulkan / DirectX 12)
#version 460
#extension GL_EXT_ray_tracing : require

layout(binding = 0, set = 0) uniform accelerationStructureEXT topLevelAS;
layout(location = 0) rayPayloadEXT vec3 hitValue;

void main() {
    vec3 origin = gl_WorldRayOriginEXT;
    vec3 direction = gl_WorldRayDirectionEXT;
    traceRayEXT(topLevelAS, gl_RayFlagsOpaqueEXT, 0xFF, 0, 0, 0, origin, 0.001, direction, 1000.0, 0);
}`,
    terminalCommand: 'dx12_benchmark --render-res=3840x2160 --raytracing=ultra',
    terminalOutput: 'Ray-Tracing Pipeline Active: 144.2 FPS (4K Ultra DLSS 3.5 Quality)\nFrame Time: 6.9ms | VRAM: 14.2 GB',
    metricLabel: 'Frame Rate @ 4K',
    metricValue: '144 FPS Raytraced',
    accentColor: '#8b5cf6',
  },
};

const reelVideoCache: Record<string, { video: string; poster: string; spec: TechMediaSpec }> = {};

export function getReelVideo(
  reelId: string,
  category: TechCategory,
  index: number
): { video: string; poster: string; spec: TechMediaSpec } {
  if (reelVideoCache[reelId]) return reelVideoCache[reelId];

  const spec = categorySpecs[category] || categorySpecs['Java'];
  const posterList = categoryPosters[category] || categoryPosters['Java'];
  const poster = posterList[index % posterList.length];
  const video = techVideoLibrary[index % techVideoLibrary.length];

  const result = {
    video,
    poster,
    spec: {
      ...spec,
      video,
      poster,
    },
  };

  reelVideoCache[reelId] = result;
  return result;
}
