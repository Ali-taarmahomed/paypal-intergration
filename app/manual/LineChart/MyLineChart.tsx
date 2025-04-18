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
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
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
        tooltip: {
            callbacks: {
                // Show the value of the last point in the tooltip
                label: (context: any) => {
                    if (context.dataIndex === context.dataset.data.length - 1) {
                        return `Last Value: ${context.raw}` // Show last point value
                    }
                    return `Value: ${context.raw}`
                },
            },
        },
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: false, // Hide grid lines for the x-axis
            },
        },
        y: {
            display: true,
            position: 'right' as const, // Move y-axis to the right side
            grid: {
                display: false, // Hide grid lines for the y-axis
            },
        },
    },
    interaction: {
        mode: 'nearest' as const, // Nearest value will be used for tooltip
        intersect: false,
    },
    elements: {
        point: {
            radius: 0, // Completely hide points
        },
        line: {
            tension: 0.4, // Smooth the line
            borderWidth: 2, // Make the line slightly thicker
        },
    },
    zoom: {
        wheel: {
            enabled: true,
            modifierKey: 'ctrl', // Hold 'ctrl' for zooming
        },
        pinch: {
            enabled: true,
        },
        drag: {
            enabled: true,
        },
    },
}

export const MyLineChart: React.FC<{ data: number[] }> = ({ data }) => {
    const myData = {
        labels: new Array(data.length).fill(' '), // Empty labels for smoother appearance
        datasets: [
            {
                label: '#',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderColor: 'rgba(0, 0, 255, 0.2)',
                data: data,
                fill: true,
            },
        ],
    }

    return <Line data={myData} options={options} />
}
