'use client'

import { useEffect, useRef } from 'react'
import { createChart, LineData, LineSeries } from 'lightweight-charts'

export const MyTradingView: React.FC<{ ticks: number[] }> = ({ ticks }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!chartContainerRef.current) return

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            handleScroll: true, // Enable scrolling to view historical data
            handleScale: true, // Allow zooming
            layout: {
                background: { color: '#121212' }, // Dark background
                textColor: '#ffffff', // White text
            },
            grid: {
                vertLines: { color: '#2a2a2a' }, // Darker grid lines
                horzLines: { color: '#2a2a2a' },
            },
        })

        const lineSeries = chart.addSeries(LineSeries, {
            color: '#f39c12',
            lineWidth: 2,
        })

        const dataX: LineData[] = [
            { time: '2024-02-25', value: 45 },
            { time: '2024-02-26', value: 48 },
            { time: '2024-02-27', value: 50 },
            { time: '2024-02-28', value: 52 },
            { time: '2024-02-29', value: 49 },
            { time: '2024-03-01', value: 50 },
            { time: '2024-03-02', value: 55 },
            { time: '2024-03-03', value: 53 },
            { time: '2024-03-04', value: 58 },
            { time: '2024-03-05', value: 54 },
        ]

        const data: LineData[] = []

        for (let i = 0; i < 10; i++) {
            const item = dataX[i]
            item.value = ticks[i]
            data.push(item)
        }

        // console.log(data)

        lineSeries.setData(data)

        // Set the visible range to the last 5 points
        chart.timeScale().setVisibleRange({
            from: data[data.length - 5].time,
            to: data[data.length - 1].time,
        })

        chart.timeScale().scrollToRealTime()

        return () => {
            chart.remove()
        }
    }, [...ticks])

    return <div ref={chartContainerRef} className='h-[300px] w-full' />
}
