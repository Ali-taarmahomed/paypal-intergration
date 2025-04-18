import React from 'react'
import Link from 'next/link'

const ComingSoonPage: React.FC = () => {
    return (
        <div style={styles.container as React.CSSProperties}>
            <div style={styles.content as React.CSSProperties}>
                <h1 style={styles.title as React.CSSProperties}>
                    Something Exciting is Coming Soon!
                </h1>
                <p style={styles.message as React.CSSProperties}>
                    Join our Telegram or WhatsApp group to stay updated on when
                    this exciting new feature will launch!
                </p>
                <div style={styles.buttonsContainerTop as React.CSSProperties}>
                    <Link href='https://t.me/+RO6d8A32aX8wYzI0'>
                        <button style={styles.button as React.CSSProperties}>
                            <img
                                src='/telegram.svg'
                                alt='Telegram'
                                style={styles.icon as React.CSSProperties}
                            />
                            Join Our Telegram
                        </button>
                    </Link>
                    <Link href='https://chat.whatsapp.com/C53x8i3jCttJxz08G6yrlp'>
                        <button style={styles.button as React.CSSProperties}>
                            <img
                                src='/Whatsapp.svg'
                                alt='WhatsApp'
                                style={styles.icon as React.CSSProperties}
                            />
                            Join Our WhatsApp
                        </button>
                    </Link>
                </div>
                <div
                    style={styles.buttonsContainerBottom as React.CSSProperties}
                >
                    <button
                        onClick={() => window.history.back()}
                        style={styles.button as React.CSSProperties}
                    >
                        Go Back
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
        padding: '20px',
    },
    content: {
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '500px',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '20px',
    },
    message: {
        fontSize: '1.2rem',
        marginBottom: '20px',
    },
    buttonsContainerTop: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '20px',
    },
    buttonsContainerBottom: {
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#f39c12',
        color: '#000',
        padding: '12px 24px',
        textDecoration: 'none',
        fontWeight: 'bold',
        borderRadius: '50px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '300px',
    },
    icon: {
        width: '20px',
        height: '20px',
        marginRight: '10px',
    },
}

export default ComingSoonPage
