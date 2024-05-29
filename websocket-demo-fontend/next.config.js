/** @type {import('next').NextConfig} */
const withImages = require('next-images')
const nextConfig = withImages({
    webpack(config, options) {
        return config;
    }
})

module.exports = nextConfig
