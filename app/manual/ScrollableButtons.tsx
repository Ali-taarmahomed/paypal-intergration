'use client'
import {
    allMarketCategories,
    setMarket,
} from '@/state/marketSelection/marketSelectionSlice'
import { AppDispatch, RootState } from '@/state/store'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const ScrollableButtons = () => {
    const selectedMarket = useSelector(
        (state: RootState) => state.selectedMarket
    )
    const scrollRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch<AppDispatch>()

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            })
        }
    }

    return (
        <div className='relative flex w-full items-center bg-gray-800 px-1'>
            {/* Left Scroll Button */}
            {/* <button
                className='absolute left-0 z-10 rounded-full bg-white shadow-md'
                onClick={() => scroll('left')}
            >
                <FaChevronLeft className='w-5 h-5' />
            </button> */}

            {/* Scrollable Buttons Container */}

            <div
                ref={scrollRef}
                className='scrollbar-hide flex gap-2 overflow-x-auto scroll-smooth px-10 py-4 text-sm text-gray-100'
            >
                {allMarketCategories.map((value, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => {
                                dispatch(setMarket(value))
                            }}
                            className={`${
                                selectedMarket == value
                                    ? 'bg-goldAli'
                                    : 'bg-black'
                            } rounded-xl px-3 py-1 hover:opacity-80`}
                        >
                            {value}
                        </button>
                    )
                })}
            </div>

            {/* Right Scroll Button */}
            {/* <button
                className='absolute right-0 z-10 rounded-full bg-white shadow-md'
                onClick={() => scroll('right')}
            >
                <FaChevronRight className='w-5 h-5' />
            </button> */}
        </div>
    )
}
