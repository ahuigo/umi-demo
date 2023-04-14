import { Graph } from '@antv/x6';
export function clearWork(container: HTMLDivElement | null, graph?: Graph) {
  if (container)
    container.innerHTML = '';
  graph?.dispose();
}