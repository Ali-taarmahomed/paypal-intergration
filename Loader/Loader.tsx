import React from 'react'

const Loader = () => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#1A1B25]'>
            <div className='h-16 w-16 animate-spin rounded-full border-t-4 border-goldAli'></div>
        </div>
    )
}

export default Loader
