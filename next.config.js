const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
  register: true,
  skipWaiting: true,
});

const config = {
  i18n: {
    locales: ['en-us', 'fr'],
    defaultLocale: 'en-us',
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
    isLivePreviewEnabled: process.env.CONTENTSTACK_LIVE_PREVIEW || 'false',
    isEditButtonsEnabled: process.env.CONTENTSTACK_LIVE_EDIT_TAGS || 'false',
    CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    CONTENTSTACK_MANAGEMENT_TOKEN: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    CONTENTSTACK_BRANCH: process.env.CONTENTSTACK_BRANCH || 'main',
    CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
    CONTENTSTACK_HOST: process.env.CONTENTSTACK_HOST,
    CONTENTSTACK_API_HOST: process.env.CONTENTSTACK_API_HOST,
    CONTENTSTACK_APP_HOST: process.env.CONTENTSTACK_APP_HOST,
    CONTENTSTACK_PREVIEW_HOST: process.env.CONTENTSTACK_PREVIEW_HOST,
    CONTENTSTACK_PREVIEW_TOKEN: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    LOCALE_COOKIE_NAME: process.env.LOCALE_COOKIE_NAME || '',
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'en',
    LOCALSTORAGE_WEBCONFIG_KEY: process.env.LOCALSTORAGE_WEBCONFIG_KEY || 'webconfig',
    LOCALSTORAGE_WEBCONFIG_TTL: process.env.LOCALSTORAGE_WEBCONFIG_TTL || '86400',
    CONTENTSTACK_PERSONALIZE_EDGE_API_URL: process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL,
    CONTENTSTACK_PERSONALIZE_PROJECT_UID: process.env.CONTENTSTACK_PERSONALIZE_PROJECT_UID,
    CONTENTSTACK_AB_EXPERIENCE_ID: process.env.CONTENTSTACK_AB_EXPERIENCE_ID || '1',
    CONTENTSTACK_AB_LANDING_PAGE_PATH: process.env.CONTENTSTACK_AB_LANDING_PAGE_PATH,
    CONTENTSTACK_AB_PRIMARY_EVENT: process.env.CONTENTSTACK_AB_PRIMARY_EVENT || 'Clicked',
    CONTENTSTACK_VISUAL_BUILDER_MODE: process.env.CONTENTSTACK_VISUAL_BUILDER_MODE || 'builder'
  },
  images: {
    domains: ["images.contentstack.io"],
  },
  experimental: {
    largePageDataBytes: 128 * 100000
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
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
            style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
            img-src 'self' data: https:;
            connect-src 'self'
              https://*.csnonprod.com
              https://*.contentstack.com
              https://*.salesforce-sites.com
              https://cdn-personalization.contentstack.com
              https://cdn.contentstack.io
              https://api.appcues.net
              wss://api.appcues.net
              https://liveagentcontentstack.secure.force.com
              https://api-iam.intercom.io
              wss://nexus-websocket-a.intercom.io
              wss://ws-mt1.pusher.com
              https://widget.usersnap.com
              https://api.commandbar.com
              https://t.commandbar.com
              https://s3.us-west-2.amazonaws.com
              https://*.browser-intake-datadoghq.eu
              https://*.contentsquare.net;
            frame-src 'self';
          `.replace(/\s{2,}/g, " "),
        },
      ],
    },
  ];
},

};

module.exports = withPWA(config);
