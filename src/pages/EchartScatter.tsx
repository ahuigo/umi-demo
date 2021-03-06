import React, { useEffect, useState } from "react";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
// import { Card, Typography, Alert } from 'antd';
// import styles from './Welcome.less';
import echarts from "echarts/lib/echarts";
import "echarts-gl";
// import data from '@/data/income.js';
// import data from '@/data/bench.json';

// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/toolbox';
// import 'echarts/lib/component/markPoint';
// import 'echarts/lib/component/markLine';

export default (): React.ReactNode => {
    useEffect(() => {
        // 初始化
        const myChart = echarts.init(
            document.getElementById("mainx") as HTMLDivElement
        );
        let data = [
            ["change", "period", "total"],
            [2, 3, 4],
            [2.5, 3.5, 4.5]
        ];
        const option = {
            tooltip: {},
            grid3D: {
                viewControl: {
                    // 使用正交投影。
                    projection: "orthographic"
                }
            },
            xAxis3D: {
                // 因为 x 轴和 y 轴都是类目数据，所以需要设置 type: 'category' 保证正确显示数据。
                type: "category"
            },
            yAxis3D: {
                type: "category"
            },
            zAxis3D: {},
            dataset: {
                dimensions: [
                    // { name: 'change', type: 'ordinal' as echarts.DimentionType },
                    // { name: 'period', },
                    "change",
                    "period",
                    "total"
                    // { name: 'Year', type: 'ordinal' as 'number' | 'float' | 'int' | 'ordinal' | 'time' }
                    // { name: 'Year', type: 'ordinal' as echarts.DimentionType }
                ],
                source: data // .filter((v: any) => v[1] >= 40)
            },
            // visualMap: {
            //     calculable: true,
            //     max: 20,
            //     // 维度的名字默认就是表头的属性名
            //     dimension: 'change',
            //     // inRange: {
            //     //     color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            //     // }
            // },
            series: [
                {
                    type: "scatter3D",
                    symbolSize: 5,
                    encode: {
                        x: "change",
                        y: "period",
                        z: "total",
                        tooltip: [0, 1, 2, 3, 4, 5]
                    }
                }
            ]
        };

        myChart.setOption(option);
    });

    return (
        <PageHeaderWrapper>
            <div id="mainx" style={{ width: "100%", height: 500 }}></div>
        </PageHeaderWrapper>
    );
};
