/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Stannect logo + brand assets are served from LeadConnector / FileSafe CDNs.
    remotePatterns: [
      { protocol: "https", hostname: "images.leadconnectorhq.com" },
      { protocol: "https", hostname: "assets.cdn.filesafe.space" },
    ],
  },
};

export default nextConfig;
