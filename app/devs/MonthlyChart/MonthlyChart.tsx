'use client'
import { MyBarChart } from './MyBarChart'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import { MarkupState } from '@/state/markups/markupsSlice'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
)

export const MonthlyChart = ({ newMarkup }: { newMarkup: MarkupState[] }) => {
    const monthy = newMarkup
        .filter(value => value.type === 'Monthly')
        .sort((a, b) => a.yyyymmdd - b.yyyymmdd)

    const labels = []
    const dataAmount = []
    const backgroundColor = []
    const borderColor = []

    for (const item of monthy) {
        labels.push(item.name)
        dataAmount.push(Math.floor(item.markupAmount * 100) / 100)
        backgroundColor.push('rgba(0, 255, 0, 1)')
        borderColor.push('rgba(0, 255, 0, 0.2)')
    }

    const data: ChartData<'bar'> = {
        labels: labels,
        datasets: [
            {
                label: 'Commissions',
                data: dataAmount,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 2,
            },
        ],
    }

    const options: ChartOptions<'bar'> = {
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'top',
                // formatter: Math.round,
                font: {
                    weight: 'bold',
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    }

    return <MyBarChart data={data} options={options} />
}
