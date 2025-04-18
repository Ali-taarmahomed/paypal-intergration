'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Step {
    title: string
    text: string
    buttons: { text: string; action?: () => void; link?: string }[]
}

const Loader = () => (
    <div className='loader-container'>
        <div className='spinner'></div>
        <p className='loader-text'>DTC AI Revolution is loading...</p>
        <style jsx>{`
            .loader-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #121212;
                color: #ffffff;
                font-family: 'Poppins', sans-serif;
            }

            .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #f39c12;
                border-top: 5px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loader-text {
                margin-top: 20px;
                font-size: 1.2rem;
                color: #f39c12;
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `}</style>
    </div>
)

const LandingPage = () => {
    const [currentStepKey, setCurrentStepKey] = useState<string>('start')
    const [showMask, setShowMask] = useState(true)
    const [wiggle, setWiggle] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setShowMask(false), 3000)
        const wiggleInterval = setInterval(() => {
            setWiggle(true)
            setTimeout(() => setWiggle(false), 500)
        }, 3000)

        return () => {
            clearTimeout(timer)
            clearInterval(wiggleInterval)
        }
    }, [])

    const steps: Record<string, Step> = {
        start: {
            title: 'Get Started in Just 60 Seconds! ⏱️',
            text: 'Follow these quick steps to get started and access the tools you need for success. It’s 100% free and super easy!',
            buttons: [
                {
                    text: 'Start Now 🚀',
                    action: () => setCurrentStepKey('welcome'),
                },
            ],
        },
        welcome: {
            title: 'Welcome to Africa&apos;s #1 Trading Solution! 👋🏻',
            text: "Whether you're new to trading or an experienced trader, we're here to help you grow your wealth with powerful tools. Follow the steps to get started today!",
            buttons: [
                {
                    text: 'Get Started 🚀',
                    action: () => setCurrentStepKey('haveDerivAccount'),
                },
            ],
        },
        haveDerivAccount: {
            title: 'First Things First! 🚀',
            text: 'Do you have a Deriv account? It’s essential to get started with DollarTradeClub. If you don’t have one yet, don’t worry—we’ll help you create it!',
            buttons: [
                {
                    text: 'Yes, I do! 👍',
                    action: () => setCurrentStepKey('registeredWithDeriv'),
                },
                {
                    text: 'No, I need help 🆘',
                    action: () => setCurrentStepKey('createDerivAccount'),
                },
            ],
        },
        createDerivAccount: {
            title: 'No Problem! 🚀',
            text: `Let’s Get You Signed Up with Deriv! Once you're done, return here to continue.

To get started, click the button below to sign up. Remember to open a real account after completing your demo registration—it’s completely FREE!`,
            buttons: [
                {
                    text: 'Sign Up with Deriv',
                    link: 'https://track.deriv.com/_Oa_r9wtmuTJZl7VyVw174GNd7ZgqdRLk/1/',
                },
                {
                    text: 'Next ➡️',
                    action: () => setCurrentStepKey('openRealAccount'),
                },
            ],
        },
        openRealAccount: {
            title: 'This is the Last Step! 🚀',
            text: `Next, all you have to do is open a real account so you can start making money—it’s completely FREE!

Click the button below to watch a YouTube tutorial on how to open your real account on Deriv. If you'd also like to open an MT5 account, you'll find the steps in the video as well.`,
            buttons: [
                {
                    text: 'Watch YouTube Tutorial 📺',
                    link: 'https://youtu.be/YgEYfz5BfOA?si=2pi3_PiJMiwkf9Bv',
                },
                {
                    text: 'Done ✅',
                    action: () => setCurrentStepKey('registeredWithDeriv'),
                },
            ],
        },
        registeredWithDeriv: {
            title: "You're all set! 🎉",
            text: `Here's what you need to do next:

👉 Visit our website to start making money for FREE. No payment required—just head over and get started!

Need help? Watch our YouTube tutorial for step-by-step guidance.`,
            buttons: [
                {
                    text: 'VISIT THE SITE AND START TRADING FOR FREE',
                    link: 'https://dollartradeclub.co.za/',
                },
                {
                    text: 'Watch YouTube Tutorial 📺',
                    link: 'https://youtu.be/Y5P83DYKL8I?si=CUQPZ_vT5gnM4QN9',
                },
                {
                    text: 'Main Menu',
                    action: () => setCurrentStepKey('haveDerivAccount'),
                },
            ],
        },
    }

    const currentStep = steps[currentStepKey]

    return (
        <>
            {showMask && <Loader />}
            <div style={{ visibility: showMask ? 'hidden' : 'visible' }}>
                <div className='landing-page'>
                    <header className='header'>
                        <div className='logo-container'>
                            <Image
                                src='/logo.svg'
                                alt='DollarTradeClub Logo'
                                width={120}
                                height={120}
                                className='logo'
                            />
                        </div>
                        <h1 className='title'>DollarTradeClub</h1>
                        <p className='subtitle'>
                            Africa&apos;s #1 Trading Solution
                        </p>
                    </header>

                    <main className='card'>
                        <h2 className='card-title'>{currentStep.title}</h2>
                        <p className='card-text'>{currentStep.text}</p>
                        <div className='button-group'>
                            {currentStep.buttons.map((button, index) =>
                                button.link ? (
                                    <a
                                        key={index}
                                        href={button.link}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='gold-button'
                                    >
                                        {button.text}
                                    </a>
                                ) : (
                                    <button
                                        key={index}
                                        className='gold-button'
                                        onClick={button.action}
                                    >
                                        {button.text}
                                    </button>
                                )
                            )}
                        </div>
                    </main>

                    <div className='links-section'>
                        <a
                            href='https://chat.whatsapp.com/C53x8i3jCttJxz08G6yrlp'
                            target='_blank'
                            rel='noopener noreferrer'
                            className={`link-button ${
                                wiggle ? 'animate-wiggle' : ''
                            }`}
                        >
                            JOIN OUR WHATSAPP GROUP 💬
                        </a>
                        <a
                            href='https://wa.link/tbr4nf'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='link-button'
                        >
                            WhatsApp ME DIRECTLY 📞
                        </a>
                        <a
                            href='https://t.me/+RO6d8A32aX8wYzI0'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='link-button'
                        >
                            JOIN OUR TELEGRAM 💸 | FREE
                        </a>
                    </div>

                    <footer className='footer'>
                        <p>© 2024 DollarTradeClub. All rights reserved.</p>
                    </footer>
                </div>
            </div>

            <style jsx>{`
                .landing-page {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #121212;
                    color: #ffffff;
                    font-family: 'Poppins', sans-serif;
                    padding: 20px;
                }

                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .logo-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 10px;
                }

                .logo {
                    display: block;
                }

                .title {
                    font-size: 2.5rem;
                    color: #f39c12;
                }

                .subtitle {
                    font-size: 1.2rem;
                    color: #d3d3d3;
                }

                .card {
                    background-color: #1f1f1f;
                    border-radius: 12px;
                    padding: 20px;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
                }

                .card-title {
                    color: #f39c12;
                    font-size: 1.8rem;
                    margin-bottom: 10px;
                }

                .card-text {
                    color: #d3d3d3;
                    font-size: 1rem;
                    margin-bottom: 20px;
                }

                .button-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .gold-button {
                    background-color: #f39c12;
                    color: #121212;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .gold-button:hover {
                    background-color: #d68d0f;
                    transform: translateY(-2px);
                }

                .links-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    margin: 20px 0;
                }

                .link-button {
                    background-color: transparent;
                    border: 2px solid #f39c12;
                    color: #f39c12;
                    font-size: 1rem;
                    font-weight: bold;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: 0.3s ease;
                    text-align: center;
                    width: 100%;
                    max-width: 300px;
                }

                .link-button:hover {
                    background-color: #f39c12;
                    color: #121212;
                }

                @keyframes wiggle {
                    0%,
                    100% {
                        transform: rotate(-3deg);
                    }
                    50% {
                        transform: rotate(3deg);
                    }
                }

                .animate-wiggle {
                    animation: wiggle 0.3s ease-in-out;
                }

                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 0.9rem;
                    color: #777;
                }
            `}</style>
        </>
    )
}

export default LandingPage
