import React, { useEffect, useRef } from "react";
import echarts from "echarts/lib/echarts";
import "echarts-gl";
import meanData from "@/data/mean.json";

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
                text: "动态数据 + 时间坐标轴"
            },
            tooltip: {
                trigger: "axis",
                formatter: function(seriesList: any[]) {
                    console.log(seriesList);
                    const series0 = seriesList[0];
                    let msg =
                        series0.data[series0.dimensionNames[series0.encode.x]] +
                        "<br>";
                    // msg += 'add:' + series0.data.add + '<br>'
                    // msg += 'period:' + series0.data.period + '<br>'
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
                    // }, {
                    //     name: "估值",
                    //     type: "line",
                    //     hoverAnimation: false,
                    //     encode: {
                    //         // amount 列映射到 x 轴
                    //         x: "trade_date",
                    //         // city 映射到 y 轴
                    //         y: "evalue"
                    //     }
                    //     itemStyle: {
                    //         color: (item) => {
                    //             return item.data.value[1] >= 0 ? 'red' : 'green'
                    //         },
                    //     },
                    //     lineStyle: {
                    //         color: "blue"
                    //     },
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
