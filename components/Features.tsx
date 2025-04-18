'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

const tabs = [
    {
        icon: '/AIbotsIcon.svg',
        title: 'DTCs AI Bots',
        description:
            'Effortlessly automate your trades with cutting-edge AI bots, designed to maximize your profits and minimize your risk 24/7.',
        image: '/AIbotsFeatures.png', // Corresponding image for AI Bots
        isNew: false,
    },
    {
        icon: '/accumulatorsicon.svg',
        title: 'Accumulators',
        description:
            'Multiply your trading potential with accumulators, allowing you to strategically stack trades for maximum returns.',
        image: '/accFeatures.png', // Corresponding image for Accumulators
        isNew: false,
    },
    {
        icon: '/Planeicon.svg',
        title: 'Aviator By DTC',
        description:
            'Experience the original Aviator game you know and love, enhanced with advanced features like martingale to boost your winning streaks.',
        image: '/aviatorFeature.png', // Corresponding image for Aviator
        isNew: true,
    },
]

export function Features() {
    const [selectedTab, setSelectedTab] = useState(0)

    const handleSelectTab = (index: number) => {
        setSelectedTab(index)
    }

    return (
        <section className='bg-[#1E2A47] py-12 md:py-20'>
            <div className='container mx-auto text-center'>
                <h2 className='mb-6 text-4xl font-bold text-white md:text-5xl'>
                    Revolutionize Your Trading
                </h2>
                <p className='mx-auto mb-10 max-w-2xl text-lg text-white/70 md:text-xl'>
                    Discover the power of AI and automation in trading. Whether
                    you&apos;re a beginner or a pro, our platform has you
                    covered.
                </p>

                {/* Tabs */}
                <div className='mb-10 flex flex-wrap justify-center gap-4'>
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`flex w-32 cursor-pointer flex-col items-center justify-center rounded-lg border p-4 transition-all duration-300 md:w-40 ${
                                selectedTab === index
                                    ? 'bg-white text-black shadow-lg'
                                    : 'border-white/20 bg-transparent text-white hover:bg-white/10'
                            }`}
                            onClick={() => handleSelectTab(index)}
                        >
                            <Image
                                src={tab.icon}
                                alt={tab.title}
                                width={40}
                                height={40}
                                className='mx-auto mb-2'
                            />
                            <h3 className='text-sm font-semibold md:text-base'>
                                {tab.title}
                            </h3>
                            {tab.isNew && (
                                <span className='mt-1 rounded-full bg-[#8c44ff] px-2 py-0.5 text-xs font-semibold text-white'>
                                    New
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tab Description */}
                <div className='mx-auto max-w-4xl rounded-lg border border-white/10 bg-white/5 p-6'>
                    <p className='text-lg text-white md:text-xl'>
                        {tabs[selectedTab].description}
                    </p>
                </div>

                {/* Image Display */}
                <motion.div
                    className='mt-10 overflow-hidden rounded-lg border border-white/10'
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0.8 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src={tabs[selectedTab].image}
                        alt={`${tabs[selectedTab].title} Overview`}
                        width={1200}
                        height={800}
                        className='h-auto w-full'
                    />
                </motion.div>
            </div>
        </section>
    )
}
