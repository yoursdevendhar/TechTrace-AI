import { useMemo } from 'react';

interface GraphNodeData {
  id: string;
  label: string;
  parent: string | null;
  level: number;
  weight: number;
}

interface GraphEdgeData {
  from: string;
  to: string;
  weight: number;
}

interface Props {
  graphData: {
    nodes: GraphNodeData[];
    edges: GraphEdgeData[];
  };
}

const LEVEL_COLORS: Record<number, string> = {
  0: '#06b6d4',
  1: '#3b82f6',
  2: '#8b5cf6',
  3: '#ec4899',
};

const LEVEL_LABELS: Record<number, string> = {
  0: 'Domain',
  1: 'Field',
  2: 'Technology',
  3: 'Concept',
};

export default function InterestGraph({ graphData }: Props) {
  const layout = useMemo(() => {
    const nodes = graphData.nodes;
    const positions: Record<string, { x: number; y: number }> = {};
    if (nodes.length === 0) return { positions, width: 900, height: 600 };

    const width = 900;
    const height = 600;
    const cx = width / 2;
    const cy = height / 2;

    const byLevel: Record<number, GraphNodeData[]> = {};
    for (const node of nodes) {
      if (!byLevel[node.level]) byLevel[node.level] = [];
      byLevel[node.level].push(node);
    }

    const levels = Object.keys(byLevel)
      .map(Number)
      .sort((a, b) => a - b);

    for (const level of levels) {
      const levelNodes = byLevel[level];
      const radius = level === 0 ? 0 : 80 + level * 90;
      const angleStep = (Math.PI * 2) / levelNodes.length;

      levelNodes.forEach((node, i) => {
        if (level === 0) {
          positions[node.id] = { x: cx, y: cy };
        } else {
          const angle = angleStep * i - Math.PI / 2;
          positions[node.id] = {
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle),
          };
        }
      });
    }

    return { positions, width, height };
  }, [graphData]);

  if (graphData.nodes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50">
        <p className="text-sm text-slate-500">
          No interest graph data yet. Interact with reels to build your interest graph.
        </p>
      </div>
    );
  }

  const { positions, width, height } = layout;
  const maxWeight = Math.max(...graphData.nodes.map((n) => n.weight), 1);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-5">
        <h2 className="text-sm font-semibold text-cyan-400">Student Interest Graph</h2>
        <p className="mt-1 text-sm text-slate-400">
          An evolving knowledge graph connecting technologies, concepts, and domains based on your
          interactions. Node size reflects interest weight. Colors represent hierarchy levels.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(LEVEL_COLORS).map(([level, color]) => (
          <div key={level} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-slate-400">
              {LEVEL_LABELS[Number(level)]} (L{level})
            </span>
          </div>
        ))}
      </div>

      {/* Graph SVG */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto"
        >
          {/* Edges */}
          {graphData.edges.map((edge, i) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            if (!from || !to) return null;
            return (
              <line
                key={`edge-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#334155"
                strokeWidth={Math.max(0.5, edge.weight * 2)}
                opacity={0.4}
              />
            );
          })}

          {/* Nodes */}
          {graphData.nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;
            const color = LEVEL_COLORS[node.level] || '#64748b';
            const size = node.weight > 0 ? 12 + (node.weight / maxWeight) * 20 : 8;
            return (
              <g key={node.id}>
                {node.weight > 0 && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size + 4}
                    fill={color}
                    opacity={0.15}
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size}
                  fill={color}
                  opacity={0.8}
                  stroke={color}
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y + size + 14}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize={node.level === 0 ? 13 : 11}
                  fontWeight={node.level === 0 ? 700 : 500}
                >
                  {node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
                </text>
                {node.weight > 0.5 && (
                  <text
                    x={pos.x}
                    y={pos.y - size - 6}
                    textAnchor="middle"
                    fill={color}
                    fontSize={9}
                    fontWeight={600}
                  >
                    {node.weight.toFixed(1)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Top connections */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-200">Strongest Interest Connections</h3>
        <div className="space-y-2">
          {graphData.edges
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 10)
            .map((edge, i) => {
              const fromNode = graphData.nodes.find((n) => n.id === edge.from);
              const toNode = graphData.nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              return (
                <div
                  key={`conn-${i}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-800/50 bg-slate-800/20 px-3 py-2"
                >
                  <span className="text-sm font-medium text-slate-200">{fromNode.label}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-violet-500/50" />
                  <span className="text-xs font-bold text-cyan-400">{(edge.weight * 100).toFixed(0)}%</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-cyan-500/50" />
                  <span className="text-sm font-medium text-slate-200">{toNode.label}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
