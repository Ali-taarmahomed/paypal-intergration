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

export const MyLineChart = ({
    data,
    title,
    percentage,
    aiEntry,
}: {
    data: number
    title: string
    percentage: number
    aiEntry: number
}) => {
    const comissionBased =
        process.env.NEXT_NODE_ENV === 'development' ? 1 : 0.97
    const newData: number[] = []

    for (let i = 0; i < data - aiEntry; i++) {
        const points =
            Math.floor(comissionBased * (1 + percentage / 100) ** i * 100) / 100

        if (points >= 1) {
            newData.push(points)
        }
    }

    const myData = {
        labels: newData.map(value => {
            console.log(value)
            return ''
        }),
        datasets: [
            {
                label: title,
                backgroundColor: 'rgba(255,140,0, 1)',
                borderColor: 'rgba(255,140,0, 1)',
                data: newData,
                fill: true,
            },
        ],
    }

    return <Line data={myData} options={options} />
}
