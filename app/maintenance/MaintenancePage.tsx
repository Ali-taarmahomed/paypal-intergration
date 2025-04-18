'use client'
import React, { Suspense } from 'react'

import { FaTools } from 'react-icons/fa'

const MaintenancePage: React.FC = () => {
    return (
        <div style={styles.container as React.CSSProperties}>
            <div style={styles.content as React.CSSProperties}>
                <FaTools style={styles.icon as React.CSSProperties} />
                <h1 style={styles.title as React.CSSProperties}>
                    We&apos;re Under Maintenance
                </h1>
                <p style={styles.message as React.CSSProperties}>
                    This section of the site is temporarily disabled for
                    maintenance. We&apos;re working hard to bring it back online
                    soon!
                </p>
                <p style={styles.subMessage as React.CSSProperties}>
                    In the meantime, why not go back to our AI bots&quest;
                </p>
                <button
                    onClick={() => window.history.back()}
                    style={styles.button as React.CSSProperties}
                >
                    Go Back
                </button>
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
