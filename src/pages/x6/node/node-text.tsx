import { useRef, useEffect } from 'react';
import { Graph, Shape } from '@antv/x6';
import { clearWork } from '../tools';


function renderFlow(container: HTMLDivElement) {
  const graph = new Graph({
    container,
    grid: true,
  });

  graph.addNode({
    x: 20,
    y: 40,
    width: 60,
    height: 60,
    label: 'rect',
    attrs: {
      body: {
        stroke: '#ffa940',
        fill: '#ffd591',
        rx: 10,
        ry: 10,
      },
      label: {
        refX: 0.5,
        refY: '100%',
        refY2: 0.2,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
      },
    },
  });
  graph.addNode({
    x: 16,
    y: 120,
    width: 360,
    height: 120,
    shape: 'text-block',
    text: `this is text`,
    attrs: {
      body: {
        fill: '#efdbff',
        stroke: '#9254de',
        rx: 4,
        ry: 4,
      },
    },
  });
}


export default function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      renderFlow(containerRef.current);
      return () => clearWork(containerRef.current);
    }
  }, [containerRef]);
  return <div ref={containerRef} className="flex h-screen w-[calc(100vw-360px)] border-gray-400 border"></div>;
}
