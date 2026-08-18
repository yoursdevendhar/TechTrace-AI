import { describe, it, expect } from 'vitest';
import {
  graphNodes,
  graphEdges,
  getNodeIdForLabel,
  getLabelForNodeId,
  getAncestors,
  getDescendants,
  getNeighbors,
} from '../data/interestGraph';

describe('Knowledge Graph & Semantic Topology Tests', () => {
  it('contains comprehensive set of technology domains and nodes', () => {
    expect(graphNodes.length).toBeGreaterThanOrEqual(30);
    expect(graphEdges.length).toBeGreaterThanOrEqual(40);
  });

  it('correctly maps labels to node IDs and vice-versa', () => {
    const javaId = getNodeIdForLabel('Java');
    expect(javaId).toBe('java');
    expect(getLabelForNodeId('java')).toBe('Java');

    const backendId = getNodeIdForLabel('Backend Development');
    expect(backendId).toBe('backend');
  });

  it('correctly resolves ancestor hierarchies for specialized skills', () => {
    const ancestors = getAncestors('rest-api');
    expect(ancestors).toContain('backend');
    expect(ancestors).toContain('software-engineering');
  });

  it('correctly resolves descendants', () => {
    const descendants = getDescendants('backend');
    expect(descendants).toContain('rest-api');
  });

  it('retrieves semantic neighbors with valid weights', () => {
    const neighbors = getNeighbors('system-design');
    expect(neighbors.length).toBeGreaterThan(0);
    expect(neighbors[0].weight).toBeGreaterThan(0);
  });
});
