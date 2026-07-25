/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'rivestore.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;