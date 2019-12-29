import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { Card, Typography, Alert } from 'antd';
// import styles from './Welcome.less';
import echarts from 'echarts/lib/echarts';
import 'echarts-gl';
// import data from '@/data/income.js';
import data from '@/data/bench.json';

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
        var myChart = echarts.init(document.getElementById('mainx') as HTMLDivElement);
        // var data = [[815, 34.05, 351014, "Australia", 1801], [1314, 39, 645526, "Canada", 1802], [985, 32, 402711280, "China", 1853], [1543, 36.26, 1181650, "Cuba", 1855], [1512, 37.35415172, 1607810, "Finland", 1861], [2146, 43.28, 36277905, "France", 1857], [2182, 38.37, 33663143, "Germany", 1881]];
        const option = {
            tooltip: {},
            grid3D: {
                viewControl: {
                    // 使用正交投影。
                    projection: 'orthographic'
                }
            },
            xAxis3D: {
                // 因为 x 轴和 y 轴都是类目数据，所以需要设置 type: 'category' 保证正确显示数据。
                // type: 'category'
            },
            yAxis3D: {},
            zAxis3D: {},
            dataset: {
                dimensions: [
                    'change',
                    'period',
                    'total',
                    // { name: 'Year', type: 'ordinal' as 'number' | 'float' | 'int' | 'ordinal' | 'time' }
                    // { name: 'Year', type: 'ordinal' as echarts.DimentionType }
                ],
                source: data,//.filter((v: any) => v[1] >= 40)
            },
            visualMap: [
                {
                    calculable: true, //可以筛选
                    max: 20,
                    min: 0,
                    dimension: 'period', // 维度的名字默认就是表头的属性名, 或者列的顺序如第二列
                },
                {
                    calculable: true, //可以筛选
                    max: 11,
                    min: 0,
                    dimension: 'change', // 维度的名字默认就是表头的属性名, 或者列的顺序如第二列
                },
                {
                    calculable: true, //可以筛选
                    max: 450001,
                    min: 250000,
                    dimension: 'total', // 维度的名字默认就是表头的属性名, 或者列的顺序如第二列
                    inRange: {
                        color: ['#FF0000', 'blue', 'green']
                    }
                },
            ],
            series: [
                {
                    type: 'scatter3D',
                    symbolSize: 5,
                    encode: {
                        x: 'change',
                        y: 'period',
                        z: 'total',
                        tooltip: [0, 1, 2, 3, 4, 5]
                    }
                }
            ]
        };

        myChart.setOption(option);
    })

    return (

        <PageHeaderWrapper>
            <div id="mainx" style={{ width: '100%', height: 500 }}></div>
        </PageHeaderWrapper>
    );
}
