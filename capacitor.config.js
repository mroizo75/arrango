const config = {
  appId: 'no.arrango.app',
  appName: 'Arrango',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://arrango.no',
      'https://www.arrango.no',
      'https://*.arrango.no',
      'https://*.clerk.accounts.dev',
      'https://clerk.com',
      'https://*.clerk.com',
      'https://ceaseless-tapir-769.convex.cloud',
      'https://*.convex.cloud',
    ],
  },
  ios: {
    scheme: 'Arrango',
    allowNavigation: [
      'https://arrango.no',
      'https://www.arrango.no',
      'https://*.arrango.no',
      'https://*.clerk.accounts.dev',
      'https://clerk.com',
      'https://*.clerk.com',
      'https://ceaseless-tapir-769.convex.cloud',
      'https://*.convex.cloud',
    ],
  },
  android: {
    allowMixedContent: true,
    allowNavigation: [
      'https://arrango.no',
      'https://www.arrango.no',
      'https://*.arrango.no',
      'https://*.clerk.accounts.dev',
      'https://clerk.com',
      'https://*.clerk.com',
      'https://ceaseless-tapir-769.convex.cloud',
      'https://*.convex.cloud',
    ],
  },
};

module.exports = config;
