// Remova o `import type` e use a importação direta
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['api.dicebear.com'],
  },
};

export default nextConfig;
