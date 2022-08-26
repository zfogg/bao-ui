const defaultTheme = require('tailwindcss/defaultTheme')

const { screens } = defaultTheme

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

// @ts-check
/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
	poweredByHeader: false,
	reactStrictMode: true,
	swcMinify: false,
	productionBrowserSourceMaps: false,
	compiler: {
		styledComponents: true,
	},
	experimental: {
		newNextLinkBehavior: true,
		scrollRestoration: true,
		images: {
			allowFutureImage: true,
		},
	},
	images: {
        deviceSizes: [640, 768, 1024, 1280, 1536, 1600],
    },
	async redirects() {
		return [
			{
				source: '/',
				destination: '/markets',
				permanent: true,
			},
		]
	},
	publicRuntimeConfig: {
		breakpoints: screens,
	},
}

module.exports = withBundleAnalyzer(nextConfig)