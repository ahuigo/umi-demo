import { useState, useRef, useCallback, useLayoutEffect } from 'react';

// ahooks中的类似实现：useMemoizedFn. 但是更新时机是：fnRef.current = useMemo(() => fn, [fn]);
function useEvent(callback: Function) {
  const callbackRef = useRef(callback);
  // 视图渲染完成后更新`handlerRef.current`指向
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  return useCallback((...args: any[]) => {
    callbackRef.current(...args);
  }, []);
}

export default () => {
  const [msg, setMsg] = useState('');
  const [msg2, sendMsg] = useState('');

  const onClick = useEvent(() => {
    sendMsg(msg);// 每次渲染onClick不仅指向同一引用, 但与useCallback 不同, 内部current变化. 不用担心msg 闭包问题. 
  });


  return <div>
    <div>received msg: {msg2}</div>
    <button onClick={() => setMsg("changeMsg")}>1.changeMsg</button>
    <button onClick={onClick}>2.sendMsg</button>
  </div>;

};