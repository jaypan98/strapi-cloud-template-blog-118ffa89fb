module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL', 'http://localhost:3001'),
      async handler(uid, { documentId, locale, status }) {
        const document = await strapi.documents(uid).findOne({ documentId });

        // Map content types to frontend routes
        const getPreviewPathname = (uid, { document }) => {
          switch (uid) {
            case 'api::article.article':
              const categorySlug = document?.category?.slug || 'uncategorized';
              return `/blog/${categorySlug}/${document.slug}`;
            case 'api::category.category':
              return `/blog/${document.slug}`;
            default:
              return '/';
          }
        };

        const pathname = getPreviewPathname(uid, { document });
        const secret = env('PREVIEW_SECRET');
        const previewUrl = `${env('CLIENT_URL', 'http://localhost:3001')}/api/preview?secret=${encodeURIComponent(secret)}&url=${encodeURIComponent(pathname)}`;

        return previewUrl;
      },
    },
  },
});
