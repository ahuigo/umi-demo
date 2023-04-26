import React, { useEffect, useState, useRef } from 'react';
import { register } from '@antv/x6-react-shape';
import { Dropdown, Tooltip } from 'antd';
import { Graph, Node, Path, Edge, Platform, StringExt } from '@antv/x6';
import { Selection } from '@antv/x6-plugin-selection';
import {
  data, styles,
  NodeType, CellStatus,
  // 加工类型列表
  PROCESSING_TYPE_LIST,
  // 不同节点类型的icon
  NODE_TYPE_LOGO,
  //    * 根据起点初始下游节点的位置信息
  getDownstreamNodePosition,
  // 根据节点的类型获取ports
  getPortsByType,
  createNode,
  createEdge,
  stopAnimate,
} from './custom/custom-all';

const DataProcessingDagNode = ({ node }: { node: Node; }) => {
  const [state, setState] = useState({
    plusActionSelected: false,
  });
  const { plusActionSelected } = state;
  // 创建下游的节点和边
  const createDownstream = (type: NodeType) => {
    const { graph } = node.model || {};
    if (graph) {
      // 获取下游节点的初始位置信息
      const position = getDownstreamNodePosition(node, graph);
      // 创建下游节点
      const newNode = createNode(type, graph, position);
      const source = node.id;
      const target = newNode.id;
      // 创建该节点出发到下游节点的边
      createEdge(source, target, graph);
    }
  };

  // 点击添加下游+号
  const clickPlusDragMenu = (type: NodeType) => {
    createDownstream(type);
    setState({
      ...state,
      plusActionSelected: false,
    });
  };

  //  获取+号下拉菜单
  const getPlusDagMenu = () => {
    return (
      <ul>
        {PROCESSING_TYPE_LIST.map((item) => {
          const content = (
            // eslint-disable-next-line
            <a onClick={() => clickPlusDragMenu(item.type)}>
              <i
                className="node-mini-logo"
                style={{ backgroundImage: `url(${NODE_TYPE_LOGO[item.type]})` }}
              />

              <span>{item.name}</span>
            </a>
          );
          return (
            <li className="each-sub-menu" key={item.type}>
              {content}
            </li>
          );
        })}
      </ul>
    );
  };

  // 添加下游菜单的打开状态变化
  const onPlusDropdownOpenChange = (value: boolean) => {
    setState({
      ...state,
      plusActionSelected: value,
    });
  };

  // 鼠标进入矩形主区域的时候显示连接桩
  const onMainMouseEnter = () => {
    // 获取该节点下的所有连接桩
    const ports = node.getPorts() || [];
    ports.forEach((port) => {
      node.setPortProp(port.id!, 'attrs/circle', {
        fill: '#fff',
        stroke: '#85A5FF',
      });
    });
  };

  // 鼠标离开矩形主区域的时候隐藏连接桩
  const onMainMouseLeave = () => {
    // 获取该节点下的所有连接桩
    const ports = node.getPorts() || [];
    ports.forEach((port) => {
      node.setPortProp(port.id!, 'attrs/circle', {
        fill: 'transparent',
        stroke: 'transparent',
      });
    });
  };

  const data = node?.getData();
  const { name, type, status, statusMsg } = data;

  return (
    <div className="data-processing-dag-node">
      <div
        className="main-area"
        onMouseEnter={onMainMouseEnter}
        onMouseLeave={onMainMouseLeave}
      >
        <div className="main-info">
          {/* 节点类型icon */}
          <i
            className="node-logo"
            style={{ backgroundImage: `url(${NODE_TYPE_LOGO[type as NodeType]})` }}
          />
          <Tooltip title={name} mouseEnterDelay={0.8}>
            <div className="ellipsis-row node-name">{name}</div>
          </Tooltip>
        </div>

        {/* 节点状态信息 */}
        <div className="status-action">
          {status === CellStatus.ERROR && (
            <Tooltip title={statusMsg}>
              <i className="status-icon status-icon-error" />
            </Tooltip>
          )}
          {status === CellStatus.SUCCESS && (
            <i className="status-icon status-icon-success" />
          )}

          {/* 节点操作菜单 */}
          <div className="more-action-container">
            <i className="more-action" />
          </div>
        </div>
      </div>

      {/* 添加下游节点 */}
      {(
        <div className="plus-dag">
          <Dropdown
            dropdownRender={getPlusDagMenu}
            overlayClassName="processing-node-menu"
            trigger={['click']}
            placement="bottom"
            open={plusActionSelected}
            onOpenChange={onPlusDropdownOpenChange}
          >
            <i className={'plus-action plus-action-selected'} />

          </Dropdown>
        </div>
      )}
    </div>
  );
};

function createGraph(container: HTMLDivElement) {
  const graph: Graph = new Graph({
    container,
    panning: {
      enabled: true,
      eventTypes: ['leftMouseDown', 'mouseWheel'],
    },
    mousewheel: {
      enabled: true,
      modifiers: 'ctrl',
      factor: 1.1,
      maxScale: 1.5,
      minScale: 0.5,
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#31d0c6',
            strokeWidth: 4,
          },
        },
      },
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      sourceAnchor: {
        name: 'left',
        args: {
          dx: Platform.IS_SAFARI ? 4 : 8,
        },
      },
      targetAnchor: {
        name: 'right',
        args: {
          dx: Platform.IS_SAFARI ? 4 : -8,
        },
      },
      createEdge() {
        return graph.createEdge({
          shape: 'data-processing-curve',
          attrs: {
            line: {
              strokeDasharray: '5 5',
            },
          },
          zIndex: -1,
        });
      },
      // 连接桩校验
      validateConnection({ sourceMagnet, targetMagnet }) {
        // 只能从输出链接桩创建连接
        if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
          return false;
        }
        // 只能连接到输入链接桩
        if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
          return false;
        }
        return true;
      },
    },
  });
  return graph;
}

export default () => {
  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const graph = createGraph(refContainer.current!);
    graph.use(
      new Selection({
        multiple: true,
        rubberEdge: true,
        rubberNode: true,
        modifiers: 'shift',
        rubberband: true,
      }),
    );
    graph.fromJSON(data);
    // graph.zoomToFit();
    showNodeStatus(graph);
    stopAnimate(graph);
  }, []);


  return (
    <div className="react-shape-app flex h-screen w-[calc(90vw)] border-gray-400 border">
      <style>{styles}</style>
      <div className="flex-1 m-8 h-screen w-[calc(90vw)]" ref={refContainer} />
    </div>
  );
};

// 节点状态列表
const nodeStatusList = [
  {
    id: 'node-0',
    status: 'success',
  },
  {
    id: 'node-1',
    status: 'success',
  },
  {
    id: 'node-2',
    status: 'success',
  },
  {
    id: 'node-3',
    status: 'success',
  },
  {
    id: 'node-4',
    status: 'error',
    statusMsg: '错误信息示例',
  },
];


// 显示节点状态
const showNodeStatus = (graph: Graph) => {
  nodeStatusList.forEach((item) => {
    const { id, status, statusMsg } = item;
    const node = graph.getCellById(id);
    const data = node.getData(); //as CellStatus
    node.setData({
      ...data,
      status,
      statusMsg,
    });
  });
};

register({
  shape: 'data-processing-dag-node',
  width: 212,
  height: 48,
  component: DataProcessingDagNode,
  // port默认不可见
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: {
          circle: { r: 4, magnet: true, stroke: 'transparent', strokeWidth: 1, fill: 'transparent', },
        },
      },

      out: {
        position: {
          name: 'right',
          args: { dx: -32, },
        },

        attrs: {
          circle: { r: 4, magnet: true, stroke: 'transparent', strokeWidth: 1, fill: 'transparent', },
        },
      },
    },
  },
});
