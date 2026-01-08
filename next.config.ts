import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/prizeless/:path*',
                destination: 'https://api.prizeless.ng/v1/:path*',
            },
        ];
    },
};

export default nextConfig;
