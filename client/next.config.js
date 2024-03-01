/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  scope: "/",
  sw: "service-worker.js",
});

const nextConfig = withPWA({
  reactStrictMode: false,
  output: "standalone",
  productionBrowserSourceMaps: false,
  experimental: {
    scrollRestoration: true,
    esmExternals: "loose",
  },
  webpack(config) {
    const imageLoaderRule = config.module.rules.find(
      (rule) => rule.loader === "next-image-loader"
    );
    config.module.rules.unshift({
      test: /\.svg$/,
      issuer: imageLoaderRule.issuer,
      dependency: imageLoaderRule.dependency,
      resourceQuery: imageLoaderRule.resourceQuery,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
        { loader: "next-image-loader", options: imageLoaderRule.options },
      ],
    });
    return config;
  },
});

module.exports = nextConfig;
