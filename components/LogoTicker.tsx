'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function LogoTicker() {
    // Array of logos alternating between devbydtc and derivlogo
    const logos = [
        '/devbydtc.svg',
        '/derivlogo.svg',
        '/devbydtc.svg',
        '/derivlogo.svg',
        '/devbydtc.svg',
        '/derivlogo.svg',
        '/devbydtc.svg',
        '/derivlogo.svg',
        '/devbydtc.svg',
        '/derivlogo.svg',
        '/devbydtc.svg',
        '/derivlogo.svg',
        '/devbydtc.svg',
        '/derivlogo.svg',
        '/devbydtc.svg',
        '/derivlogo.svg',
    ]

    return (
        <section className='bg-gradient-to-br from-[#212c3a] via-[#000e1f] to-[#344a63] py-5'>
            <div className='container mx-auto text-center'>
                {/* Title */}
                <h2 className='mb-4 text-2xl font-bold text-white md:text-3xl'>
                    Powered By Top Innovative Teams
                </h2>

                {/* Pill-Shaped Container */}
                <div className='rounded-full bg-gradient-to-r from-[#162c49] to-[#1d334d] p-2 shadow-md md:p-4'>
                    <div className='relative w-full overflow-hidden'>
                        <motion.div
                            className='flex gap-6'
                            initial={{ translateX: 0 }}
                            animate={{ translateX: '-100%' }}
                            transition={{
                                repeat: Infinity,
                                duration: 15,
                                ease: 'linear',
                            }}
                        >
                            {/* First Loop of Logos */}
                            {logos.map((logo, index) => (
                                <Image
                                    src={logo}
                                    alt={`Logo ${index + 1}`}
                                    key={index}
                                    width={100} // Adjusted width for thinner pill
                                    height={50} // Adjusted height for smaller logos
                                    className='object-contain'
                                />
                            ))}

                            {/* Duplicate Loop of Logos */}
                            {logos.map((logo, index) => (
                                <Image
                                    src={logo}
                                    alt={`Logo duplicate ${index + 1}`}
                                    key={`duplicate-${index}`}
                                    width={100}
                                    height={50}
                                    className='object-contain'
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
