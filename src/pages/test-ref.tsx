import React, { useState, useEffect } from "react";

const DnamicNode = ({ v }) => {
    const i = useState(Math.random())[0];
    useEffect(() => {
        return () => console.log("destruct", i);
    }, []);
    return (
        <div>
            {v},inner={i}{" "}
        </div>
    );
};
export default (): React.ReactNode => {
    const [v, setV] = useState(0);
    return (
        <div>
            <div onClick={() => setV(v + 1)}>rese value:{v}</div>
            <DnamicNode key={v} v={v} />
        </div>
    );
};
