/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || true, // Completely disable PWA
  publicExcludes: ['!noprecache/**/*'], // Exclude all files from precaching
  buildExcludes: [/.*$/], // Exclude all files from build precaching
})

const config = withPWA({
  i18n: {
    locales: ["en-us", "fr"],
    defaultLocale: "en-us",
  },
  publicRuntimeConfig: {
    CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
    CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    CONTENTSTACK_BRANCH: process.env.CONTENTSTACK_BRANCH || "main",
    CONTENTSTACK_REGION: process.env.CONTENTSTACK_REGION || "us",
    CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
    CONTENTSTACK_PREVIEW_TOKEN: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    CONTENTSTACK_PREVIEW_HOST:
      process.env.CONTENTSTACK_PREVIEW_HOST || "rest-preview.contentstack.com",
    CONTENTSTACK_API_HOST:
      process.env.CONTENTSTACK_API_HOST || "api.contentstack.io",
    CONTENTSTACK_APP_HOST:
      process.env.CONTENTSTACK_APP_HOST || "app.contentstack.com",
    CONTENTSTACK_LIVE_PREVIEW: process.env.CONTENTSTACK_LIVE_PREVIEW || "true",
    CONTENTSTACK_LIVE_EDIT_TAGS:
      process.env.CONTENTSTACK_LIVE_EDIT_TAGS || "false",
  },
  env: {
    CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
    isLivePreviewEnabled: process.env.CONTENTSTACK_LIVE_PREVIEW || "false",
    isEditButtonsEnabled: process.env.CONTENTSTACK_LIVE_EDIT_TAGS || "false",
    CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    CONTENTSTACK_MANAGEMENT_TOKEN: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    CONTENTSTACK_BRANCH: process.env.CONTENTSTACK_BRANCH || "main",
    CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
    CONTENTSTACK_HOST: process.env.CONTENTSTACK_HOST,
    CONTENTSTACK_API_HOST: process.env.CONTENTSTACK_API_HOST,
    CONTENTSTACK_APP_HOST: process.env.CONTENTSTACK_APP_HOST,
    CONTENTSTACK_PREVIEW_HOST: process.env.CONTENTSTACK_PREVIEW_HOST,
    CONTENTSTACK_PREVIEW_TOKEN: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    LOCALE_COOKIE_NAME: process.env.LOCALE_COOKIE_NAME || "",
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || "en",
    LOCALSTORAGE_WEBCONFIG_KEY:
      process.env.LOCALSTORAGE_WEBCONFIG_KEY || "webconfig",
    LOCALSTORAGE_WEBCONFIG_TTL:
      process.env.LOCALSTORAGE_WEBCONFIG_TTL || "86400",
    CONTENTSTACK_PERSONALIZE_EDGE_API_URL:
      process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL,
    CONTENTSTACK_PERSONALIZE_PROJECT_UID:
      process.env.CONTENTSTACK_PERSONALIZE_PROJECT_UID,
    CONTENTSTACK_AB_EXPERIENCE_ID:
      process.env.CONTENTSTACK_AB_EXPERIENCE_ID || "1",
    CONTENTSTACK_AB_LANDING_PAGE_PATH:
      process.env.CONTENTSTACK_AB_LANDING_PAGE_PATH,
    CONTENTSTACK_AB_PRIMARY_EVENT:
      process.env.CONTENTSTACK_AB_PRIMARY_EVENT || "Clicked",
    CONTENTSTACK_VISUAL_BUILDER_MODE:
      process.env.CONTENTSTACK_VISUAL_BUILDER_MODE || "builder",
  },
  images: {
    domains: ["images.contentstack.io"],
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
              script-src * 'unsafe-inline' 'unsafe-eval';
              style-src * 'unsafe-inline';
              font-src * data:;
              img-src * data: blob:;
              connect-src *;
              frame-src *;
              object-src *;
              media-src *;
            `.replace(/\s{2,}/g, " "),
          },
        ],
      },
    ];
  },
})

module.exports = config;
