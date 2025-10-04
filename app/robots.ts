import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/connect/',
        '/tickets/purchase-success',
        '/api/',
      ],
    },
    sitemap: 'https://www.arrango.no/sitemap.xml',
    host: 'https://www.arrango.no',
  }
}
