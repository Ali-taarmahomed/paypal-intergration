'use client'
import React from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
            position: 'top' as const,
        },
        title: {
            display: false,
            text: 'Digit Chart',
        },
        // annotation: {
        //     drawTime: 'afterDraw',
        //     annotations: [
        //         {
        //             id: 'line1',
        //             type: 'line',
        //             mode: 'horizontal',
        //             scaleID: 'y-axis',
        //             value: 4.5,
        //             borderWidth: 2,
        //             borderColor: 'red',
        //             label: {
        //                 content: 'threshold 1',
        //                 enabled: true,
        //                 position: 'right',
        //             },
        //         },
        //     ],
        // },
    },
}

const newData: number[] = []

newData.push(
    ...(() => {
        const arr = []
        let prev = 1.05
        for (let i = 0; i < 100; i++) {
            prev = prev * 1.05
            arr.push(prev)
        }
        return arr
    })()
)

export const MyLineChartStatic = () => {
    const myData = {
        labels: newData.map(value => {
            console.log(value)
            return ''
        }),
        datasets: [
            {
                label: 'title',
                backgroundColor: 'rgba(255,140,0, 1)',
                borderColor: 'rgba(255,140,0, 1)',
                data: newData,
                fill: true,
            },
        ],
    }

    return <Line data={myData} options={options} />
}
