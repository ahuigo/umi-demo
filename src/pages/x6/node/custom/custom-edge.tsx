import { Graph, Node, Path, Edge, Platform, StringExt } from '@antv/x6';
import {
  NodeType, Position, PROCESSING_TYPE_LIST,
} from './custom-data';

// 根据节点的类型获取ports
export const getPortsByType = (type: NodeType, nodeId: string) => {
  let ports = [];
  switch (type) {
    case NodeType.INPUT:
      ports = [
        {
          id: `${nodeId}-out`,
          group: 'out',
        },
      ];
      break;
    case NodeType.OUTPUT:
      ports = [
        {
          id: `${nodeId}-in`,
          group: 'in',
        },
      ];
      break;
    default:
      ports = [
        {
          id: `${nodeId}-in`,
          group: 'in',
        },
        {
          id: `${nodeId}-out`,
          group: 'out',
        },
      ];
      break;
  }
  return ports;
};

/**
 * 创建边并添加到画布
 * @param source
 * @param target
 * @param graph
 */
export const createEdge = (source: string, target: string, graph: Graph) => {
  const edge = {
    id: StringExt.uuid(),
    shape: 'data-processing-curve',
    source: {
      cell: source,
      port: `${source}-out`,
    },
    target: {
      cell: target,
      port: `${target}-in`,
    },
    zIndex: -1,
    data: {
      source,
      target,
    },
  };
  if (graph) {
    graph.addEdge(edge);
  }
};

/**
 * 根据起点初始下游节点的位置信息
 * @param node 起始节点
 * @param graph
 * @returns
 */
export const getDownstreamNodePosition = (
  node: Node,
  graph: Graph,
  dx = 250,
  dy = 100,
) => {
  // 找出画布中以该起始节点为起点的相关边的终点id集合
  const downstreamNodeIdList: string[] = [];
  graph.getEdges().forEach((edge) => {
    const originEdge = edge.toJSON()?.data;
    if (originEdge.source === node.id) {
      downstreamNodeIdList.push(originEdge.target);
    }
  });
  // 获取起点的位置信息
  const position = node.getPosition();
  let minX = Infinity;
  let maxY = -Infinity;
  graph.getNodes().forEach((graphNode) => {
    if (downstreamNodeIdList.indexOf(graphNode.id) > -1) {
      const nodePosition = graphNode.getPosition();
      // 找到所有节点中最左侧的节点的x坐标
      if (nodePosition.x < minX) {
        minX = nodePosition.x;
      }
      // 找到所有节点中最x下方的节点的y坐标
      if (nodePosition.y > maxY) {
        maxY = nodePosition.y;
      }
    }
  });

  return {
    x: minX !== Infinity ? minX : position.x + dx,
    y: maxY !== -Infinity ? maxY + dy : position.y,
  };
};

// 注册连线
Graph.registerConnector(
  'curveConnector',
  (sourcePoint, targetPoint) => {
    const hgap = Math.abs(targetPoint.x - sourcePoint.x);
    const path = new Path();
    path.appendSegment(
      Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y),
    );
    path.appendSegment(
      Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y),
    );
    // 水平三阶贝塞尔曲线
    path.appendSegment(
      Path.createSegment(
        'C',
        sourcePoint.x < targetPoint.x
          ? sourcePoint.x + hgap / 2
          : sourcePoint.x - hgap / 2,
        sourcePoint.y,
        sourcePoint.x < targetPoint.x
          ? targetPoint.x - hgap / 2
          : targetPoint.x + hgap / 2,
        targetPoint.y,
        targetPoint.x - 6,
        targetPoint.y,
      ),
    );
    path.appendSegment(
      Path.createSegment('L', targetPoint.x + 2, targetPoint.y),
    );

    return path.serialize();
  },
  true,
);

Edge.config({
  markup: [
    {
      tagName: 'path',
      selector: 'wrap',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
        stroke: 'transparent',
        strokeLinecap: 'round',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        pointerEvents: 'none',
      },
    },
  ],
  connector: { name: 'curveConnector' },
  attrs: {
    wrap: {
      connection: true,
      strokeWidth: 10,
      strokeLinejoin: 'round',
    },
    line: {
      connection: true,
      stroke: '#A2B1C3',
      strokeWidth: 1,
      targetMarker: {
        name: 'classic',
        size: 6,
      },
    },
  },
});

Graph.registerEdge('data-processing-curve', Edge, true);
