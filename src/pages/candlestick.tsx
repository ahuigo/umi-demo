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
                data: ["Dow-Jones index", "MA5", "MA10", "MA20", "MA30"]
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
                position: function(
                    pos: any,
                    params: any,
                    el: any,
                    elRect: any,
                    size: any
                ) {
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
            brush: {
                xAxisIndex: "all",
                brushLink: "all",
                outOfBrush: {
                    colorAlpha: 0.1
                }
            },
            grid: [
                {
                    left: "10%",
                    right: "8%",
                    height: "50%"
                },
                {
                    left: "10%",
                    right: "8%",
                    bottom: "20%",
                    height: "15%"
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
                },
                {
                    type: "category",
                    gridIndex: 1,
                    data: data.categoryData,
                    scale: true,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    splitNumber: 20,
                    min: "dataMin",
                    max: "dataMax",
                    axisPointer: {
                        label: {
                            formatter: function(params: any) {
                                const seriesValue = (params.seriesData[0] || {})
                                    .value;
                                return (
                                    params.value +
                                    (seriesValue != null
                                        ? "\n" + seriesValue
                                        : "")
                                );
                            }
                        }
                    }
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                },
                {
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false }
                }
            ],
            dataZoom: [
                {
                    type: "inside",
                    xAxisIndex: [0, 1],
                    start: 98,
                    end: 100
                },
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: "slider",
                    top: "85%",
                    start: 98,
                    end: 100
                }
            ],
            series: [
                {
                    name: "Dow-Jones index",
                    type: "candlestick",
                    data: data.values,
                    itemStyle: {
                        normal: {
                            color: "#06B800",
                            color0: "#FA0000",
                            borderColor: null,
                            borderColor0: null
                        }
                    },
                    tooltip: {
                        formatter: function(param: any) {
                            param = param[0];
                            return [
                                "Date: " +
                                    param.name +
                                    '<hr size=1 style="margin: 3px 0">',
                                "Open: " + param.data[0] + "<br/>",
                                "Close: " + param.data[1] + "<br/>",
                                "Lowest: " + param.data[2] + "<br/>",
                                "Highest: " + param.data[3] + "<br/>"
                            ].join("");
                        }
                    }
                },
                {
                    name: "MA5",
                    type: "line",
                    data: calculateMA(5, data),
                    smooth: true,
                    lineStyle: {
                        normal: { opacity: 0.5 }
                    }
                },
                {
                    name: "MA10",
                    type: "line",
                    data: calculateMA(10, data),
                    smooth: true,
                    lineStyle: {
                        normal: { opacity: 0.5 }
                    }
                },
                {
                    name: "MA20",
                    type: "line",
                    data: calculateMA(20, data),
                    smooth: true,
                    lineStyle: {
                        normal: { opacity: 0.5 }
                    }
                },
                {
                    name: "MA30",
                    type: "line",
                    data: calculateMA(30, data),
                    smooth: true,
                    lineStyle: {
                        normal: { opacity: 0.5 }
                    }
                },
                {
                    name: "Volumn",
                    type: "bar",
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: data.volumns
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
    const volumns = [];
    for (let i = 0; i < rawData.length; i++) {
        const value = [...rawData[i]];
        categoryData.push(value.splice(0, 1)[0]);
        values.push(value);
        volumns.push(value[4]);
    }
    return {
        categoryData: categoryData,
        values: values,
        volumns: volumns
    };
}

function calculateMA(dayCount, data) {
    const result = [];
    for (let i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push("-");
        } else {
            let sum = 0;
            for (let j = 0; j < dayCount; j++) {
                sum += data.values[i - j][1];
            }
            result.push(+(sum / dayCount).toFixed(3));
        }
    }
    return result;
}
