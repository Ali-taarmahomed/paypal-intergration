'use client'
import { useRef, useEffect, useState } from 'react'

export const CurveCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [time, setTime] = useState(0)

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d')

        if (ctx && canvasRef.current) {
            const canvas = canvasRef.current
            const width = canvas.width
            const height = canvas.height

            const draw = () => {
                ctx.clearRect(0, 0, width, height)

                // Draw x and y axes
                ctx.beginPath()
                ctx.moveTo(40, height - 40)
                ctx.lineTo(width, height - 40)
                ctx.moveTo(40, height - 40)
                ctx.lineTo(40, 0)
                ctx.strokeStyle = '#000'
                ctx.stroke()

                // Draw increasing curve
                ctx.beginPath()
                ctx.moveTo(40, height - 40)
                let lastX = 40
                let lastY = height - 40
                for (let i = 0; i <= time; i++) {
                    const x = 40 + i * 50
                    const y = height - 40 - i * 20 // Positive increasing values
                    ctx.lineTo(x, y)
                    lastX = x
                    lastY = y
                }
                ctx.strokeStyle = 'rgba(0, 255, 0, 1)' // Orange color for the curve
                ctx.stroke()

                // Color the area under the curve
                ctx.lineTo(lastX, height - 40)
                ctx.lineTo(40, height - 40)
                ctx.fillStyle = 'rgba(255, 140, 0, 1)' // Lighter orange color for the fill
                ctx.fill()

                // Draw the number inside the colored area under the curve
                const areaCenterX = (40 + lastX) / 2
                const areaCenterY = (height - 40 + lastY) / 2
                ctx.fillStyle = '#fff'
                ctx.font = '20px Arial'
                ctx.fillText('1.35X', areaCenterX + 30, areaCenterY + 20)
            }

            draw()

            const interval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime >= 10) {
                        clearInterval(interval)
                        return prevTime
                    }
                    return prevTime + 1
                })
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [time])

    return <canvas ref={canvasRef} width={600} height={400} />
}
