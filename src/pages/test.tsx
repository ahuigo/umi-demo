import React, { useState } from "react";
const Div = ({ v }: any) => {
    let dom: any;
    console.log(v, "=>Div");
    return (
        <div
            // key={v}
            ref={node => {
                if (node) {
                    dom = node;
                }
            }}
            onClick={() => {
                dom.innerHTML = "变成非受控组件：" + `v=${v},` + Math.random();
                console.log(dom);
            }}
        >
            v:{v}
        </div>
    );
};
const DnamicNode = ({ v, setV }: any) => {
    console.log(v);
    return (
        <div>
            <input
                key={v}
                defaultValue={v}
                onKeyUp={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter") {
                        const v = e.target.value;
                        setV(v);
                    }
                }}
            />
        </div>
    );
};
export default (): React.ReactNode => {
    const [v, setV] = useState("");
    const reset = () => {
        setV("");
    };
    const props = { v, setV };

    return (
        <div>
            <div onClick={reset}>rese value:{v}</div>
            {/* {DnamicNode({v, setV})} */}
            {/* <DnamicNode {...props}/> */}
            <DnamicNode {...props} />
            <DnamicNode {...props} />
            <DnamicNode {...props} />
            <DnamicNode {...props} />
            <Div v={v} />
            {/* <DnamicNode key={'b'} {...props}/>
        <DnamicNode key={'c'} {...props}/>
        <DnamicNode key={'d'} {...props}/> */}
        </div>
    );
};
