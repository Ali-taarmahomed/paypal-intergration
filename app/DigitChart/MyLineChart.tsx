import React, { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface MyLineChartProps {
    data: number[] // Contains tick data for continuous updates
}

export const MyLineChart: React.FC<MyLineChartProps> = ({ data }) => {
    const [dataPoints, setDataPoints] = useState<{ value: number }[]>([])
    const [decimalPlaces, setDecimalPlaces] = useState(2)

    // Initialize the chart with the last 20 ticks and set decimal places based on the first tick
    useEffect(() => {
        if (data.length > 0) {
            const initialPoints = data.slice(-20).map(value => ({ value }))
            setDataPoints(initialPoints)

            // Determine decimal places based on the first tick of the data
            const decimalMatch = data[0].toString().match(/\.(\d+)/)
            setDecimalPlaces(decimalMatch ? decimalMatch[1].length : 0)
        }
    }, [data])

    // Update chart in real-time with each new tick, keeping the latest 20 ticks
    useEffect(() => {
        if (data.length > 0) {
            setDataPoints(prevPoints => {
                const latestTick = { value: data[data.length - 1] }
                const updatedPoints = [...prevPoints, latestTick]

                if (updatedPoints.length > 20) {
                    updatedPoints.shift() // Keep only the latest 20 ticks
                }

                return updatedPoints
            })
        }
    }, [data])

    // Calculate dynamic Y-axis range based on actual data points
    const minValue = Math.min(...dataPoints.map(point => point.value))
    const maxValue = Math.max(...dataPoints.map(point => point.value))
    const buffer = (maxValue - minValue) * 0.1 || 0.5 // Add a small buffer to the range
    const dynamicDomain = [minValue - buffer, maxValue + buffer]

    return (
        <ResponsiveContainer width='100%' height={300}>
            <LineChart
                data={dataPoints}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid stroke='rgba(255, 255, 255, 0.2)' />
                <XAxis
                    dataKey='name'
                    reversed // Moves data from right to left
                    tick={false} // Hide X-axis labels for clarity
                />
                <YAxis
                    domain={dynamicDomain}
                    tickCount={5} // Reasonable number of increments for better readability
                    tickFormatter={value => value.toFixed(decimalPlaces)} // Format based on detected decimal places
                />
                <Tooltip
                    formatter={(value: number) => value.toFixed(decimalPlaces)}
                />
                <Line
                    type='linear' // Keeps the line sharp and direct
                    dataKey='value'
                    stroke='rgba(243, 156, 18, 0.8)'
                    strokeWidth={3} // Increase line thickness for better visibility
                    fill='rgba(243, 156, 18, 0.3)' // Fill color for the area under the line
                    fillOpacity={0.3} // Opacity to make the fill slightly transparent
                    dot={{ r: 4, fill: 'rgba(243, 156, 18, 0.8)' }} // Small dots on all data points
                    isAnimationActive={false} // Disable animation for instant update
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
