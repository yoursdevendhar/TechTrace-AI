import type { GraphNode, GraphEdge } from '@/types';

export const graphNodes: GraphNode[] = [
  { id: 'software-engineering', label: 'Software Engineering', parent: null, level: 0 },
  { id: 'programming', label: 'Programming', parent: 'software-engineering', level: 1 },
  { id: 'java', label: 'Java', parent: 'programming', level: 2 },
  { id: 'python', label: 'Python', parent: 'programming', level: 2 },
  { id: 'javascript', label: 'JavaScript', parent: 'programming', level: 2 },
  { id: 'oop', label: 'OOP', parent: 'programming', level: 2 },
  { id: 'functional-programming', label: 'Functional Programming', parent: 'programming', level: 2 },
  { id: 'backend', label: 'Backend Development', parent: 'software-engineering', level: 1 },
  { id: 'rest-api', label: 'REST APIs', parent: 'backend', level: 2 },
  { id: 'graphql', label: 'GraphQL', parent: 'backend', level: 2 },
  { id: 'grpc', label: 'gRPC', parent: 'backend', level: 2 },
  { id: 'authentication', label: 'Authentication', parent: 'backend', level: 2 },
  { id: 'databases', label: 'Databases', parent: 'backend', level: 2 },
  { id: 'dbms', label: 'DBMS', parent: 'databases', level: 3 },
  { id: 'sql', label: 'SQL', parent: 'databases', level: 3 },
  { id: 'nosql', label: 'NoSQL', parent: 'databases', level: 3 },
  { id: 'redis', label: 'Redis', parent: 'databases', level: 3 },
  { id: 'postgresql', label: 'PostgreSQL', parent: 'databases', level: 3 },
  { id: 'fastapi', label: 'FastAPI', parent: 'backend', level: 2 },
  { id: 'spring-boot', label: 'Spring Boot', parent: 'backend', level: 2 },
  { id: 'nodejs', label: 'Node.js', parent: 'backend', level: 2 },
  { id: 'computer-science', label: 'Computer Science', parent: 'software-engineering', level: 1 },
  { id: 'dsa', label: 'DSA', parent: 'computer-science', level: 2 },
  { id: 'algorithms', label: 'Algorithms', parent: 'dsa', level: 3 },
  { id: 'data-structures', label: 'Data Structures', parent: 'dsa', level: 3 },
  { id: 'operating-systems', label: 'Operating Systems', parent: 'computer-science', level: 2 },
  { id: 'networks', label: 'Computer Networks', parent: 'computer-science', level: 2 },
  { id: 'devops', label: 'DevOps', parent: 'software-engineering', level: 1 },
  { id: 'docker', label: 'Docker', parent: 'devops', level: 2 },
  { id: 'kubernetes', label: 'Kubernetes', parent: 'devops', level: 2 },
  { id: 'cicd', label: 'CI/CD', parent: 'devops', level: 2 },
  { id: 'terraform', label: 'Terraform', parent: 'devops', level: 2 },
  { id: 'monitoring', label: 'Monitoring', parent: 'devops', level: 2 },
  { id: 'ai', label: 'AI', parent: null, level: 0 },
  { id: 'machine-learning', label: 'Machine Learning', parent: 'ai', level: 1 },
  { id: 'deep-learning', label: 'Deep Learning', parent: 'machine-learning', level: 2 },
  { id: 'cnn', label: 'CNN', parent: 'deep-learning', level: 3 },
  { id: 'reinforcement-learning', label: 'Reinforcement Learning', parent: 'machine-learning', level: 2 },
  { id: 'llms', label: 'LLMs', parent: 'ai', level: 1 },
  { id: 'rag', label: 'RAG', parent: 'llms', level: 2 },
  { id: 'prompt-engineering', label: 'Prompt Engineering', parent: 'llms', level: 2 },
  { id: 'fine-tuning', label: 'Fine-tuning', parent: 'llms', level: 2 },
  { id: 'vector-db', label: 'Vector Databases', parent: 'ai', level: 1 },
  { id: 'embeddings', label: 'Embeddings', parent: 'vector-db', level: 2 },
  { id: 'nlp', label: 'NLP', parent: 'ai', level: 1 },
  { id: 'system-design', label: 'System Design', parent: 'software-engineering', level: 1 },
  { id: 'scalability', label: 'Scalability', parent: 'system-design', level: 2 },
  { id: 'load-balancing', label: 'Load Balancing', parent: 'system-design', level: 2 },
  { id: 'caching', label: 'Caching', parent: 'system-design', level: 2 },
  { id: 'sharding', label: 'Database Sharding', parent: 'system-design', level: 2 },
  { id: 'microservices', label: 'Microservices', parent: 'system-design', level: 2 },
  { id: 'message-queues', label: 'Message Queues', parent: 'system-design', level: 2 },
  { id: 'api-gateway', label: 'API Gateway', parent: 'system-design', level: 2 },
  { id: 'rate-limiting', label: 'Rate Limiting', parent: 'system-design', level: 2 },
  { id: 'cybersecurity', label: 'Cybersecurity', parent: null, level: 0 },
  { id: 'web-security', label: 'Web Security', parent: 'cybersecurity', level: 1 },
  { id: 'sql-injection', label: 'SQL Injection', parent: 'web-security', level: 2 },
  { id: 'xss', label: 'XSS', parent: 'web-security', level: 2 },
  { id: 'owasp', label: 'OWASP', parent: 'web-security', level: 2 },
  { id: 'cryptography', label: 'Cryptography', parent: 'cybersecurity', level: 1 },
  { id: 'encryption', label: 'Encryption', parent: 'cryptography', level: 2 },
  { id: 'password-hashing', label: 'Password Hashing', parent: 'cryptography', level: 2 },
  { id: 'penetration-testing', label: 'Penetration Testing', parent: 'cybersecurity', level: 1 },
  { id: 'zero-trust', label: 'Zero Trust', parent: 'cybersecurity', level: 1 },
  { id: 'network-security', label: 'Network Security', parent: 'cybersecurity', level: 1 },
  { id: 'cloud', label: 'Cloud', parent: null, level: 0 },
  { id: 'aws', label: 'AWS', parent: 'cloud', level: 1 },
  { id: 'azure', label: 'Azure', parent: 'cloud', level: 1 },
  { id: 'gcp', label: 'GCP', parent: 'cloud', level: 1 },
  { id: 'serverless', label: 'Serverless', parent: 'cloud', level: 1 },
  { id: 'hardware', label: 'Hardware', parent: null, level: 0 },
  { id: 'gpu', label: 'GPU', parent: 'hardware', level: 1 },
  { id: 'cpu', label: 'CPU', parent: 'hardware', level: 1 },
  { id: 'ssd', label: 'SSD', parent: 'hardware', level: 1 },
  { id: 'raspberry-pi', label: 'Raspberry Pi', parent: 'hardware', level: 1 },
  { id: 'pc-build', label: 'PC Build', parent: 'hardware', level: 1 },
  { id: 'laptop', label: 'Laptop', parent: 'hardware', level: 1 },
  { id: 'homelab', label: 'Home Lab', parent: 'hardware', level: 1 },
  { id: 'career', label: 'Career', parent: null, level: 0 },
  { id: 'interviews', label: 'Interviews', parent: 'career', level: 1 },
  { id: 'resume', label: 'Resume', parent: 'career', level: 1 },
  { id: 'salary', label: 'Salary', parent: 'career', level: 1 },
  { id: 'portfolio', label: 'Portfolio', parent: 'career', level: 1 },
  { id: 'frontend', label: 'Frontend', parent: 'software-engineering', level: 1 },
  { id: 'react', label: 'React', parent: 'frontend', level: 2 },
  { id: 'nextjs', label: 'Next.js', parent: 'frontend', level: 2 },
  { id: 'typescript', label: 'TypeScript', parent: 'frontend', level: 2 },
  { id: 'css', label: 'CSS', parent: 'frontend', level: 2 },
  { id: 'design-system', label: 'Design System', parent: 'frontend', level: 2 },
  { id: 'tech-news', label: 'Tech News', parent: null, level: 0 },
  { id: 'open-source', label: 'Open Source', parent: 'tech-news', level: 1 },
  { id: 'entertainment', label: 'Entertainment', parent: null, level: 0 },
  { id: 'gaming', label: 'Gaming', parent: null, level: 0 },
  { id: 'esports', label: 'Esports', parent: 'gaming', level: 1 },
];

export const graphEdges: GraphEdge[] = [
  // Parent-child edges are implicit via the node hierarchy; these are cross-domain connections
  { from: 'java', to: 'spring-boot', weight: 0.9 },
  { from: 'java', to: 'oop', weight: 0.85 },
  { from: 'java', to: 'dsa', weight: 0.7 },
  { from: 'java', to: 'backend', weight: 0.8 },
  { from: 'python', to: 'fastapi', weight: 0.9 },
  { from: 'python', to: 'machine-learning', weight: 0.8 },
  { from: 'python', to: 'backend', weight: 0.75 },
  { from: 'python', to: 'data-structures', weight: 0.6 },
  { from: 'javascript', to: 'nodejs', weight: 0.9 },
  { from: 'javascript', to: 'react', weight: 0.85 },
  { from: 'javascript', to: 'frontend', weight: 0.8 },
  { from: 'backend', to: 'rest-api', weight: 0.95 },
  { from: 'backend', to: 'databases', weight: 0.9 },
  { from: 'backend', to: 'authentication', weight: 0.8 },
  { from: 'backend', to: 'system-design', weight: 0.75 },
  { from: 'backend', to: 'docker', weight: 0.7 },
  { from: 'backend', to: 'microservices', weight: 0.75 },
  { from: 'dsa', to: 'interviews', weight: 0.85 },
  { from: 'dsa', to: 'algorithms', weight: 0.95 },
  { from: 'dsa', to: 'data-structures', weight: 0.95 },
  { from: 'dsa', to: 'career', weight: 0.7 },
  { from: 'system-design', to: 'interviews', weight: 0.8 },
  { from: 'system-design', to: 'scalability', weight: 0.9 },
  { from: 'system-design', to: 'microservices', weight: 0.85 },
  { from: 'system-design', to: 'load-balancing', weight: 0.85 },
  { from: 'system-design', to: 'caching', weight: 0.8 },
  { from: 'system-design', to: 'message-queues', weight: 0.8 },
  { from: 'system-design', to: 'api-gateway', weight: 0.75 },
  { from: 'system-design', to: 'sharding', weight: 0.75 },
  { from: 'system-design', to: 'rate-limiting', weight: 0.7 },
  { from: 'devops', to: 'docker', weight: 0.95 },
  { from: 'devops', to: 'kubernetes', weight: 0.9 },
  { from: 'devops', to: 'cicd', weight: 0.9 },
  { from: 'devops', to: 'cloud', weight: 0.85 },
  { from: 'devops', to: 'terraform', weight: 0.8 },
  { from: 'devops', to: 'monitoring', weight: 0.8 },
  { from: 'devops', to: 'backend', weight: 0.7 },
  { from: 'docker', to: 'kubernetes', weight: 0.85 },
  { from: 'docker', to: 'backend', weight: 0.7 },
  { from: 'docker', to: 'cloud', weight: 0.7 },
  { from: 'docker', to: 'cicd', weight: 0.7 },
  { from: 'kubernetes', to: 'cloud', weight: 0.8 },
  { from: 'kubernetes', to: 'microservices', weight: 0.8 },
  { from: 'cicd', to: 'devops', weight: 0.85 },
  { from: 'cicd', to: 'cloud', weight: 0.65 },
  { from: 'ai', to: 'machine-learning', weight: 0.95 },
  { from: 'ai', to: 'llms', weight: 0.9 },
  { from: 'ai', to: 'nlp', weight: 0.85 },
  { from: 'ai', to: 'vector-db', weight: 0.8 },
  { from: 'ai', to: 'python', weight: 0.7 },
  { from: 'ai', to: 'gpu', weight: 0.75 },
  { from: 'llms', to: 'rag', weight: 0.9 },
  { from: 'llms', to: 'prompt-engineering', weight: 0.85 },
  { from: 'llms', to: 'fine-tuning', weight: 0.85 },
  { from: 'llms', to: 'nlp', weight: 0.8 },
  { from: 'rag', to: 'vector-db', weight: 0.9 },
  { from: 'rag', to: 'embeddings', weight: 0.85 },
  { from: 'vector-db', to: 'embeddings', weight: 0.9 },
  { from: 'vector-db', to: 'databases', weight: 0.7 },
  { from: 'machine-learning', to: 'deep-learning', weight: 0.9 },
  { from: 'machine-learning', to: 'python', weight: 0.8 },
  { from: 'machine-learning', to: 'cnn', weight: 0.75 },
  { from: 'machine-learning', to: 'reinforcement-learning', weight: 0.8 },
  { from: 'deep-learning', to: 'gpu', weight: 0.8 },
  { from: 'gpu', to: 'hardware', weight: 0.9 },
  { from: 'gpu', to: 'gaming', weight: 0.65 },
  { from: 'gpu', to: 'deep-learning', weight: 0.8 },
  { from: 'gpu', to: 'ai', weight: 0.7 },
  { from: 'cpu', to: 'hardware', weight: 0.85 },
  { from: 'cpu', to: 'operating-systems', weight: 0.6 },
  { from: 'cybersecurity', to: 'web-security', weight: 0.9 },
  { from: 'cybersecurity', to: 'cryptography', weight: 0.85 },
  { from: 'cybersecurity', to: 'network-security', weight: 0.85 },
  { from: 'cybersecurity', to: 'penetration-testing', weight: 0.8 },
  { from: 'cybersecurity', to: 'backend', weight: 0.6 },
  { from: 'cybersecurity', to: 'authentication', weight: 0.7 },
  { from: 'web-security', to: 'owasp', weight: 0.9 },
  { from: 'web-security', to: 'sql-injection', weight: 0.85 },
  { from: 'web-security', to: 'xss', weight: 0.85 },
  { from: 'web-security', to: 'backend', weight: 0.65 },
  { from: 'cryptography', to: 'encryption', weight: 0.9 },
  { from: 'cryptography', to: 'password-hashing', weight: 0.85 },
  { from: 'cryptography', to: 'authentication', weight: 0.7 },
  { from: 'cloud', to: 'aws', weight: 0.9 },
  { from: 'cloud', to: 'serverless', weight: 0.8 },
  { from: 'cloud', to: 'devops', weight: 0.75 },
  { from: 'cloud', to: 'docker', weight: 0.7 },
  { from: 'cloud', to: 'kubernetes', weight: 0.7 },
  { from: 'cloud', to: 'system-design', weight: 0.6 },
  { from: 'aws', to: 'serverless', weight: 0.7 },
  { from: 'aws', to: 'devops', weight: 0.65 },
  { from: 'career', to: 'interviews', weight: 0.9 },
  { from: 'career', to: 'resume', weight: 0.85 },
  { from: 'career', to: 'salary', weight: 0.8 },
  { from: 'career', to: 'portfolio', weight: 0.8 },
  { from: 'career', to: 'software-engineering', weight: 0.6 },
  { from: 'interviews', to: 'dsa', weight: 0.8 },
  { from: 'interviews', to: 'system-design', weight: 0.8 },
  { from: 'interviews', to: 'career', weight: 0.85 },
  { from: 'frontend', to: 'react', weight: 0.9 },
  { from: 'frontend', to: 'typescript', weight: 0.8 },
  { from: 'frontend', to: 'css', weight: 0.8 },
  { from: 'frontend', to: 'nextjs', weight: 0.75 },
  { from: 'frontend', to: 'design-system', weight: 0.7 },
  { from: 'frontend', to: 'backend', weight: 0.6 },
  { from: 'react', to: 'javascript', weight: 0.85 },
  { from: 'react', to: 'nextjs', weight: 0.8 },
  { from: 'typescript', to: 'javascript', weight: 0.9 },
  { from: 'typescript', to: 'frontend', weight: 0.75 },
  { from: 'homelab', to: 'devops', weight: 0.7 },
  { from: 'homelab', to: 'hardware', weight: 0.8 },
  { from: 'homelab', to: 'docker', weight: 0.6 },
  { from: 'raspberry-pi', to: 'hardware', weight: 0.8 },
  { from: 'raspberry-pi', to: 'python', weight: 0.6 },
  { from: 'pc-build', to: 'gpu', weight: 0.7 },
  { from: 'pc-build', to: 'hardware', weight: 0.85 },
  { from: 'laptop', to: 'hardware', weight: 0.8 },
  { from: 'laptop', to: 'pc-build', weight: 0.65 },
  { from: 'gaming', to: 'gpu', weight: 0.7 },
  { from: 'gaming', to: 'hardware', weight: 0.65 },
  { from: 'gaming', to: 'esports', weight: 0.8 },
  { from: 'open-source', to: 'career', weight: 0.6 },
  { from: 'open-source', to: 'programming', weight: 0.65 },
  { from: 'tech-news', to: 'ai', weight: 0.5 },
  { from: 'tech-news', to: 'career', weight: 0.5 },
  { from: 'entertainment', to: 'gaming', weight: 0.3 },
  { from: 'authentication', to: 'jwt', weight: 0.0 },
  { from: 'databases', to: 'dbms', weight: 0.9 },
  { from: 'databases', to: 'sql', weight: 0.9 },
  { from: 'databases', to: 'nosql', weight: 0.85 },
  { from: 'databases', to: 'redis', weight: 0.8 },
  { from: 'databases', to: 'postgresql', weight: 0.85 },
  { from: 'redis', to: 'caching', weight: 0.85 },
  { from: 'redis', to: 'backend', weight: 0.7 },
  { from: 'caching', to: 'system-design', weight: 0.75 },
  { from: 'caching', to: 'backend', weight: 0.7 },
  { from: 'microservices', to: 'api-gateway', weight: 0.8 },
  { from: 'microservices', to: 'message-queues', weight: 0.8 },
  { from: 'microservices', to: 'docker', weight: 0.7 },
  { from: 'microservices', to: 'kubernetes', weight: 0.7 },
  { from: 'message-queues', to: 'backend', weight: 0.7 },
  { from: 'message-queues', to: 'system-design', weight: 0.75 },
  { from: 'api-gateway', to: 'rate-limiting', weight: 0.75 },
  { from: 'api-gateway', to: 'load-balancing', weight: 0.7 },
  { from: 'api-gateway', to: 'authentication', weight: 0.65 },
  { from: 'rate-limiting', to: 'system-design', weight: 0.7 },
  { from: 'load-balancing', to: 'scalability', weight: 0.85 },
  { from: 'sharding', to: 'databases', weight: 0.8 },
  { from: 'sharding', to: 'scalability', weight: 0.8 },
  { from: 'scalability', to: 'cloud', weight: 0.65 },
  { from: 'serverless', to: 'cloud', weight: 0.8 },
  { from: 'serverless', to: 'backend', weight: 0.6 },
  { from: 'network-security', to: 'networks', weight: 0.7 },
  { from: 'network-security', to: 'zero-trust', weight: 0.75 },
  { from: 'penetration-testing', to: 'web-security', weight: 0.8 },
  { from: 'penetration-testing', to: 'owasp', weight: 0.75 },
  { from: 'zero-trust', to: 'network-security', weight: 0.8 },
  { from: 'zero-trust', to: 'authentication', weight: 0.65 },
];

const nodeMap: Record<string, GraphNode> = Object.fromEntries(
  graphNodes.map((n) => [n.id, n])
);

export function getNode(id: string): GraphNode | undefined {
  return nodeMap[id];
}

export function getAncestors(nodeId: string): string[] {
  const ancestors: string[] = [];
  let current = nodeMap[nodeId];
  while (current && current.parent) {
    ancestors.push(current.parent);
    current = nodeMap[current.parent];
  }
  return ancestors;
}

export function getDescendants(nodeId: string): string[] {
  const descendants: string[] = [];
  const children = graphNodes.filter((n) => n.parent === nodeId);
  for (const child of children) {
    descendants.push(child.id);
    descendants.push(...getDescendants(child.id));
  }
  return descendants;
}

const edgeMap: Record<string, GraphEdge[]> = {};
for (const edge of graphEdges) {
  if (!edgeMap[edge.from]) edgeMap[edge.from] = [];
  edgeMap[edge.from].push(edge);
  if (!edgeMap[edge.to]) edgeMap[edge.to] = [];
  edgeMap[edge.to].push({ from: edge.to, to: edge.from, weight: edge.weight });
}

export function getNeighbors(nodeId: string): GraphEdge[] {
  return edgeMap[nodeId] || [];
}

export function getRelatedTopics(topicId: string, maxDepth = 2): Map<string, number> {
  const result = new Map<string, number>();
  const visited = new Set<string>([topicId]);
  const queue: { id: string; depth: number; weight: number }[] = [
    { id: topicId, depth: 0, weight: 1 },
  ];

  while (queue.length > 0) {
    const { id, depth, weight } = queue.shift()!;
    if (depth > 0) {
      result.set(id, Math.max(result.get(id) || 0, weight));
    }
    if (depth >= maxDepth) continue;

    const neighbors = getNeighbors(id);
    for (const edge of neighbors) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push({ id: edge.to, depth: depth + 1, weight: weight * edge.weight * 0.7 });
      }
    }

    const parent = nodeMap[id]?.parent;
    if (parent && !visited.has(parent)) {
      visited.add(parent);
      queue.push({ id: parent, depth: depth + 1, weight: weight * 0.6 });
    }

    const children = graphNodes.filter((n) => n.parent === id);
    for (const child of children) {
      if (!visited.has(child.id)) {
        visited.add(child.id);
        queue.push({ id: child.id, depth: depth + 1, weight: weight * 0.5 });
      }
    }
  }

  return result;
}

export function getNodeIdForLabel(label: string): string | undefined {
  const node = graphNodes.find(
    (n) => n.label.toLowerCase() === label.toLowerCase()
  );
  return node?.id;
}

export function getLabelForNodeId(nodeId: string): string {
  return nodeMap[nodeId]?.label || nodeId;
}
