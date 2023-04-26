import React, { useEffect, useState, useRef } from 'react';
import { Graph, Node, Path, Edge, Platform, StringExt } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import { Dropdown, Tooltip } from 'antd';

import {
  NodeType, Position, PROCESSING_TYPE_LIST,
  NODE_TYPE_LOGO, CellStatus,
} from './custom-data';
import { getPortsByType, createEdge, getDownstreamNodePosition } from './custom-edge';

/**
 * 创建节点并添加到画布
 * @param type 节点类型
 * @param graph
 * @param position 节点位置
 * @returns
 */
export const createNode = (
  type: NodeType,
  graph: Graph,
  position?: Position,
) => {
  if (!graph) {
    return {} as Node;
  }
  let newNode: Node = {} as Node;
  const sameTypeNodes = graph
    .getNodes()
    .filter((item) => item.getData()?.type === type);
  const typeName = PROCESSING_TYPE_LIST?.find(
    (item) => item.type === type,
  )?.name;
  const id = StringExt.uuid();
  const node = {
    id,
    shape: 'data-processing-dag-node',
    x: position?.x,
    y: position?.y,
    ports: getPortsByType(type, id),
    data: {
      name: `${typeName}_${sameTypeNodes.length + 1}`,
      type,
    },
  };
  newNode = graph.addNode(node);
  return newNode;
};


const TaskNode = ({ node }: { node: Node; }) => {
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

register({
  shape: 'data-processing-dag-node',
  width: 212,
  height: 48,
  component: TaskNode,
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