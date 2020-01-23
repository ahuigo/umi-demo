import React, { useEffect, useRef } from "react";
import echarts from "echarts/lib/echarts";
import "echarts-gl";
import rawData from "@/data1/stock-ohlc.json";

export default (): React.ReactNode => {
    const refEl = useRef(null);
    useEffect(() => {
        // 初始化
        const myChart = echarts.init(
            // document.getElementById("main2") as HTMLDivElement
            (refEl.current as unknown) as HTMLDivElement
        );
        const data = splitData(rawData);

        const option = {
            backgroundColor: "#eee",
            animation: false,
            legend: {
                bottom: 10,
                left: "center",
                data: ["Dow-Jones index"]
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross"
                },
                backgroundColor: "rgba(245, 245, 245, 0.8)",
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                textStyle: {
                    color: "#000"
                },
                position: function(pos, params, el, elRect, size) {
                    const obj = { top: 10 };
                    obj[
                        ["left", "right"][+(pos[0] < size.viewSize[0] / 2)]
                    ] = 30;
                    return obj;
                },
                extraCssText: "width: 170px"
            },
            axisPointer: {
                link: { xAxisIndex: "all" },
                label: {
                    backgroundColor: "#777"
                }
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: false
                    },
                    brush: {
                        type: ["lineX", "clear"]
                    }
                }
            },
            grid: [
                {
                    left: "10%",
                    right: "8%",
                    bottom: 150
                }
            ],
            xAxis: [
                {
                    type: "category",
                    data: data.categoryData,
                    scale: true,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    splitLine: { show: false },
                    splitNumber: 20,
                    min: "dataMin",
                    max: "dataMax",
                    axisPointer: {
                        z: 100
                    }
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                }
            ],
            dataZoom: [
                {
                    type: "inside",
                    start: 98,
                    end: 100,
                    minValueSpan: 10
                },
                {
                    show: true,
                    type: "slider",
                    bottom: 60,
                    start: 98,
                    end: 100,
                    minValueSpan: 10
                }
            ],
            series: [
                {
                    name: "Dow-Jones index",
                    type: "custom",
                    renderItem: renderItem,
                    dimensions: [null, "open", "close", "lowest", "highest"],
                    encode: {
                        x: 0,
                        y: [1, 2, 3, 4],
                        tooltip: [1, 2, 3, 4]
                    },
                    data: data.values
                }
            ]
        };

        myChart.setOption(option);
    });
    return (
        <div>
            <h1>title</h1>
            <div ref={refEl} style={{ width: "100%", height: 500 }}></div>
        </div>
    );
};

function splitData(rawData) {
    const categoryData = [];
    const values = [];
    for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i][0]);
        rawData[i][0] = i;
        values.push(rawData[i]);
    }
    return {
        categoryData: categoryData,
        values: values
    };
}

function renderItem(params, api) {
    const xValue = api.value(0);
    const openPoint = api.coord([xValue, api.value(1)]);
    const closePoint = api.coord([xValue, api.value(2)]);
    const lowPoint = api.coord([xValue, api.value(3)]);
    const highPoint = api.coord([xValue, api.value(4)]);
    const halfWidth = api.size([1, 0])[0] * 0.35;
    const style = api.style({
        stroke: api.visual("color")
    });

    return {
        type: "group",
        children: [
            {
                type: "line",
                shape: {
                    x1: lowPoint[0],
                    y1: lowPoint[1],
                    x2: highPoint[0],
                    y2: highPoint[1]
                },
                style: style
            },
            {
                type: "line",
                shape: {
                    x1: openPoint[0],
                    y1: openPoint[1],
                    x2: openPoint[0] - halfWidth,
                    y2: openPoint[1]
                },
                style: style
            },
            {
                type: "line",
                shape: {
                    x1: closePoint[0],
                    y1: closePoint[1],
                    x2: closePoint[0] + halfWidth,
                    y2: closePoint[1]
                },
                style: style
            }
        ]
    };
}
