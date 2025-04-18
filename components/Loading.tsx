import React from 'react'

export const Loading = () => {
    return (
        <div className='flex h-screen w-screen flex-col items-center justify-center gap-3 font-bold text-goldAli'>
            <Loader></Loader>
            <h2 className='text-xl font-bold text-goldAli'>Loading</h2>
        </div>
    )
}

export const Loader = () => {
    return (
        <div
            className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
            role='status'
        >
            <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                Loading...
            </span>
        </div>
    )
}
