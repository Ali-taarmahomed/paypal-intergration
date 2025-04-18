'use client'
import React from 'react'
import { MyLineChart } from './MyLineChart'

export const DigitChart = ({ data }: { data: number[] }) => {
    console.log(data)
    return (
        <div className='flex w-full items-center justify-center border-2 border-goldAli p-4'>
            <MyLineChart data={data} />
        </div>
    )
}
