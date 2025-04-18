'use client'
import { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

const AviatorGraph = () => {
    const [dataPoints, setDataPoints] = useState<{ x: number; y: number }[]>([
        { x: 0, y: 0 },
    ])
    const [planePosition, setPlanePosition] = useState<{
        x: number
        y: number
    }>({ x: 0, y: 0 })
    const svgRef = useRef<SVGSVGElement>(null)
    const [isStalling, setIsStalling] = useState(false)
    const xScaleRef = useRef<d3.ScaleLinear<number, number>>()
    const yScaleRef = useRef<d3.ScaleLinear<number, number>>()
    const [planeSize, setPlaneSize] = useState(100) // Initial plane size

    useEffect(() => {
        // Adjust plane size based on window width for responsiveness
        const updatePlaneSize = () => {
            const width = window.innerWidth
            setPlaneSize(width < 600 ? 50 : 100) // Smaller plane size on mobile
        }

        updatePlaneSize()
        window.addEventListener('resize', updatePlaneSize)

        return () => window.removeEventListener('resize', updatePlaneSize)
    }, [])

    useEffect(() => {
        let x = 0
        const intervalId = setInterval(() => {
            if (x >= 5.05) {
                clearInterval(intervalId)
                setIsStalling(true)
                return
            }
            x += 0.1
            const y = Math.pow(1.5, x) - 1
            setDataPoints(prev => [...prev, { x, y }])
            setPlanePosition({ x, y })
        }, 100)

        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        if (isStalling) {
            const peakY = Math.pow(1.5, 5.15) - 1
            const stallInterval = setInterval(() => {
                setPlanePosition(prev => ({
                    x: prev.x,
                    y: peakY + Math.sin(Date.now() / 500) * 0.1,
                }))
            }, 100)

            return () => clearInterval(stallInterval)
        }
    }, [isStalling])

    useEffect(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current)
            svg.selectAll('*').remove()

            const width = svgRef.current.clientWidth
            const height = svgRef.current.clientHeight
            const margin = { top: 0, right: 0, bottom: 0, left: 0 } // Reduced margins

            const xScale = d3
                .scaleLinear()
                .domain([0, 6])
                .range([margin.left, width]) // Extend fully without margin on the right

            const yScale = d3
                .scaleLinear()
                .domain([0, Math.pow(1.5, 5.25) - 1])
                .range([height - margin.bottom, margin.top])

            xScaleRef.current = xScale
            yScaleRef.current = yScale

            if (xScaleRef.current && yScaleRef.current) {
                // Draw the filled area below the path
                svg.append('path')
                    .datum(dataPoints)
                    .attr('fill', 'rgba(255,0,0,0.4)')
                    .attr('stroke', 'none')
                    .attr(
                        'd',
                        d3
                            .area<{ x: number; y: number }>()
                            .x(d => xScaleRef.current!(d.x))
                            .y0(yScaleRef.current!(0))
                            .y1(d => yScaleRef.current!(d.y))
                    )

                // Draw the path line
                svg.append('path')
                    .datum(dataPoints)
                    .attr('fill', 'none')
                    .attr('stroke', 'rgba(255,0,0,1)')
                    .attr('stroke-width', 2)
                    .attr(
                        'd',
                        d3
                            .line<{ x: number; y: number }>()
                            .x(d => xScaleRef.current!(d.x))
                            .y(d => yScaleRef.current!(d.y))
                    )
            }
        }
    }, [dataPoints])

    return (
        <div className='relative h-full w-full overflow-hidden'>
            <svg ref={svgRef} className='h-full w-full'></svg>
            <svg className='absolute h-full w-full' style={{ top: 0, left: 0 }}>
                <image
                    href='/plane.svg'
                    x={
                        xScaleRef.current
                            ? xScaleRef.current(planePosition.x)
                            : 0
                    }
                    y={
                        yScaleRef.current
                            ? yScaleRef.current(planePosition.y)
                            : 0
                    }
                    width={planeSize} // Adjust plane size based on screen width
                    height={planeSize} // Adjust plane size based on screen width
                    style={{
                        transform: `translate(-${planeSize / 4.5}px, -${
                            planeSize / 2
                        }px)`,
                        transition: 'x 0.1s linear, y 0.1s linear',
                    }}
                />
            </svg>
            <style jsx>{`
                @keyframes xAxisDots {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.33%);
                    }
                }
                .animate-xAxisDots {
                    animation: xAxisDots 8s linear infinite;
                }

                @keyframes yAxisDotsVertical {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-100%);
                    }
                }
                .animate-yAxisDotsVertical {
                    animation: yAxisDotsVertical 8s linear infinite;
                }
            `}</style>
        </div>
    )
}

export default AviatorGraph
