'use client'
import React, { Suspense } from 'react'

import { FaTools } from 'react-icons/fa'

const MaintenancePage: React.FC = () => {
    return (
        <div style={styles.container as React.CSSProperties}>
            <div style={styles.content as React.CSSProperties}>
                <FaTools style={styles.icon as React.CSSProperties} />
                <h1 style={{ ...styles.title, color: '#dcdcdc' }}>
                    {' '}
                    {/* Updated color */}
                    We&apos;re Under Maintenance
                </h1>
                <p style={{ ...styles.message, color: '#dcdcdc' }}>
                    {' '}
                    {/* Updated color */}
                    Our site is currently down for maintenance as we’re working
                    on exciting updates to serve you better! Stay connected and
                    be the first to know when we’re back online by joining our
                    WhatsApp channel. We appreciate your patience and can’t wait
                    to share what’s coming!
                </p>
                <p style={{ ...styles.subMessage, color: '#dcdcdc' }}>
                    {' '}
                    {/* Updated color */}
                    In the meantime, why not follow our whatsapp channel below
                    for updates:
                </p>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        alignItems: 'center',
                    }}
                >
                    <button
                        onClick={() =>
                            window.open(
                                'https://whatsapp.com/channel/0029Vav3cKj4yltNZHSV0F0c',
                                '_blank'
                            )
                        }
                        style={styles.button as React.CSSProperties}
                    >
                        Follow Our WhatsApp Channel
                    </button>
                    <button
                        onClick={() =>
                            window.open(
                                'https://chat.whatsapp.com/C53x8i3jCttJxz08G6yrlp',
                                '_blank'
                            )
                        }
                        style={styles.button as React.CSSProperties}
                    >
                        Join Our Free WhatsApp Community Group
                    </button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background:
            'linear-gradient(135deg, var(--blueAli), var(--DarkerBlue))',
        color: 'var(--foreground)',
        fontFamily: 'Arial, sans-serif',
    },
    content: {
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
    },
    icon: {
        fontSize: '4rem',
        marginBottom: '20px',
        color: 'var(--goldAli)',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '20px',
    },
    message: {
        fontSize: '1.2rem',
        marginBottom: '10px',
    },
    subMessage: {
        fontSize: '1rem',
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#f39c12',
        color: '#000',
        padding: '12px 24px',
        textDecoration: 'none',
        fontWeight: 'bold',
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    buttonHover: {
        backgroundColor: '#d48806',
    },
    buttonIcon: {
        marginRight: '8px',
        fontSize: '1.2rem',
    },
}

const Page: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MaintenancePage />
        </Suspense>
    )
}

export default Page
