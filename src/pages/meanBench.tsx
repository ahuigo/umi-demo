import React, { useEffect, useRef } from "react";
// import { PageHeaderWrapper } from "@ant-design/pro-layout";
// import { Card, Typography, Alert } from 'antd';
// import styles from './Welcome.less';
import echarts from "echarts/lib/echarts";
import "echarts-gl";
import meanData from "@/data/meanBench.json";

export default (): React.ReactNode => {
    const refEl = useRef(null);
    useEffect(() => {
        // 初始化
        const myChart = echarts.init(
            // document.getElementById("main2") as HTMLDivElement
            (refEl.current as unknown) as HTMLDivElement
        );

        const option = {
            title: {
                text: "haha"
            },
            tooltip: {
                trigger: "axis",
                formatter: function(seriesList: any[]) {
                    console.log(seriesList);
                    const series0 = seriesList[0];
                    let msg =
                        series0.data[series0.dimensionNames[series0.encode.x]] +
                        "<br>";
                    msg += "num:" + series0.data.num + "<br>";
                    msg += "balance:" + series0.data.balance + "<br>";
                    msg += "strategy:" + series0.data.strategy + "<br>";
                    for (const params of seriesList) {
                        const key = params.dimensionNames[params.encode.y];
                        msg +=
                            params.seriesName +
                            ":" +
                            params.data[key] +
                            "<br/>";
                    }
                    return msg;
                }
            },
            dataZoom: {
                // orient: "vertical", //水平显示
                show: true, // 显示滚动条
                start: 0, // 起始值为20%
                end: 100, // 结束值为60%
                type: "inside" // inside 是施放zoom, slider是滚动条zoom
            },
            xAxis: {
                type: "time"
                // splitLine: {
                //     show: true,
                // }
            },
            yAxis: {
                type: "value"
                // splitLine: {
                //     show: false,
                // }
            },
            dataset: {
                // dimensions: ['trade_date', 'close', 'mean', 'code'],
                source: meanData
            },
            series: [
                {
                    name: "价格",
                    type: "line",
                    // showSymbol: true,
                    hoverAnimation: false,
                    encode: {
                        // amount 列映射到 x 轴
                        x: "trade_date",
                        // city 映射到 y 轴
                        y: "close"
                    },
                    itemStyle: {
                        // color: "green", //symbol color
                        color: "black",
                        lineStyle: {
                            width: 1,
                            color: "black"
                        }
                    }
                },
                {
                    name: "均线",
                    type: "line",
                    hoverAnimation: false,
                    encode: {
                        // amount 列映射到 x 轴
                        x: "trade_date",
                        // city 映射到 y 轴
                        y: "mean"
                    }
                },
                {
                    name: "total",
                    type: "line",
                    encode: {
                        x: "trade_date",
                        y: "total"
                    },
                    // symbol: 'circle',
                    // showSymbol: true,
                    itemStyle: {
                        // normal: {
                        // color: "green", //symbol color
                        //     lineStyle: {
                        //         width: 10,
                        //         color: "purple", //line color
                        //     },
                        color: (item: any) => {
                            // console.log(item)
                            return item.data.num > 0 ? "red" : "green";
                        }
                        // }
                    },
                    lineStyle: {
                        width: 5,
                        color: "blue"
                    }
                }
            ]
        };

        myChart.setOption(option);
        // setInterval(() => {

        //     //update data
        //     myChart.setOption({
        //         series: [{
        //             data: getData(1)
        //         }, {
        //             data: getData(10)
        //         }]
        //     });
        // }, 50000);
    });
    return (
        <div>
            <h1>{meanData && meanData[0] && meanData[0].code}</h1>
            <div ref={refEl} style={{ width: "100%", height: 500 }}></div>
        </div>
    );
};
