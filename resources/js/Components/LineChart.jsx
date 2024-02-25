import { DualAxes } from '@ant-design/plots';
import React from 'react';
import { useLang } from '../Context/LangContext';

const LineChart = (props) => {
    const { lang } = useLang();
    const {data, nameChart, xField, yField} = props;
    const config = {
        data: [data, data],
        padding: 'auto',
        height: 350,
        autoFit: false,
        xField: xField,
        yField: yField,
        point: {
            size: 5,
            shape: 'diamond',
        },
        geometryOptions: [
            {
                geometry: 'line',
                color: '#5B8FF9',
            },
            {
                geometry: 'line',
                color: '#5AD8A6',
            },
        ],
    };

    let chart;

    return (
        <div className="px-2.5 py-2.5 overflow-x-scroll">
            <div className="flex gap-4">
                <p className="mb-7 text-xl font-semibold">{nameChart}</p>              
            </div>
            <DualAxes {...config} onReady={(chartInstance) => (chart = chartInstance)} />
        </div>
    );
}

export default LineChart;
