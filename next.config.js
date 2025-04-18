/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    cacheOnFrontEndNav: true,
    reloadOnOnline: true,
    disable: process.env.NEXT_NODE_ENV === 'development',
})

const nextConfig = {
    async headers() {
        return [
            {
                // Routes this applies to
                source: '/api/(.*)',
                // Headers
                headers: [
                    // Allow for specific domains to have access or * for all
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                        // DOES NOT WORK
                        // value: process.env.ALLOWED_ORIGIN,
                    },
                    // Allows for specific methods accepted
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    // Allows for specific headers accepted (These are a few standard ones)
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization',
                    },
                ],
            },
        ]
    },
    reactStrictMode: true, // Enable React strict mode for improved error handling
    swcMinify: true, // Enable SWC minification for improved performance
    compiler: {
        removeConsole: process.env.NEXT_NODE_ENV !== 'development', // Remove console.log in production
    },
    // output: 'standalone', //for docker
    // images: {
    // 	remotePatterns: [
    // 		{
    // 			protocol: 'http',
    // 			hostname: 'localhost',
    // 			port: '3000',
    // 			pathname: '/*',
    // 		},
    // 		{
    // 			protocol: 'https',
    // 			hostname: 'oracle-machine.vercel.app',
    // 			port: '',
    // 			pathname: '/*',
    // 		},
    // 	],
    // },
}
module.exports = withPWA(nextConfig)

// module.exports = nextConfig;
module.exports = {
    env: {
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL, // ✅ expose to app
    },
}
