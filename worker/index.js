export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Restrict production host normalization to the two public domains.
    // Local and preview hosts continue to serve assets for verification.
    if (url.hostname === 'www.usmanramzan.com' ||
        (url.hostname === 'usmanramzan.com' && url.protocol !== 'https:')) {
      url.hostname = 'usmanramzan.com';
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.href, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
