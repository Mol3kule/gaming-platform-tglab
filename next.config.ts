import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default withNextIntl(nextConfig);
