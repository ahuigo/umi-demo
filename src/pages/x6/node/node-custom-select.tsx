import React, { useEffect, useState, useRef } from 'react';
import { register } from '@antv/x6-react-shape';
import { Graph, Node } from '@antv/x6';
import { Selection } from '@antv/x6-plugin-selection';
const data = {
  nodes: [
    {
      id: "node-0",
      shape: "data-processing-dag-node",
      x: 0,
      y: 100,
      // ports: [{ id: "node-0-out", group: "out" }],
      data: { name: "数据输入_1", type: "INPUT", checkStatus: "sucess" }
    }
  ]
};
const styles = `
.main-area {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2px;
  width: 100px;
  height: 38px;
  color: rgba(0, 0, 0, 65%);
  font-size: 12px;
  font-family: PingFangSC;
  line-height: 24px;
  background-color: #fff;
  box-shadow: 0 -1px 4px 0 rgba(209, 209, 209, 50%), 1px 1px 4px 0 rgba(217, 217, 217, 50%);
  border-radius: 2px;
  border: 1px solid transparent;
}
.main-area:hover {
  border: 1px solid rgba(0, 0, 0, 10%);
  box-shadow: 0 -2px 4px 0 rgba(209, 209, 209, 50%), 2px 2px 4px 0 rgba(217, 217, 217, 50%);
}

.plus-dag {
  visibility: hidden;
  position: relative;
  margin-left: 12px;
  height: 48px;

  position: absolute;
  top: calc(50% - 8px);
  left: 0;
  width: 16px;
  height: 16px;
  background: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*k9cnSaSmlw4AAAAAAAAAAAAADtOHAQ/original') no-repeat center center / 100% 100%;
  cursor: pointer;
}


.x6-node-selected .main-area {
  border-color: #3471f9;
}

.x6-node-selected .plus-dag {
  visibility: visible;
}
      `;

const DataProcessingDagNode = ({ node }: { node: Node; }) => {
  return (
    <div className="data-processing-dag-node">
      <div className="main-area" >abc</div>
      <i className={'plus-dag'} />
    </div>
  );
};

register({
  shape: 'data-processing-dag-node',
  width: 212,
  height: 108,
  component: DataProcessingDagNode,
});

function createGraph(container: HTMLDivElement) {
  const graph: Graph = new Graph({
    container,
  });
  return graph;
}

export default () => {
  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const graph = createGraph(refContainer.current!);
    graph.use(
      new Selection({
      }),
    );
    graph.fromJSON(data);
    const zoomOptions = {
      padding: {
        left: 10,
        right: 10,
      },
    };
    graph.zoomToFit(zoomOptions);
  }, []);


  return (
    <div className="react-shape-app flex h-screen w-[calc(90vw)] border-gray-400 border">
      <style>{styles}</style>
      <div className="border border-solid flex-1 m-8 h-screen w-[calc(90vw)]" ref={refContainer} />
    </div>
  );
};
