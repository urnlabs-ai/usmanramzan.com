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
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('Content-Type');
    if (contentType?.split(';')[0].trim() === 'text/html' && !/charset=/i.test(contentType)) {
      const headers = new Headers(response.headers);
      headers.set('Content-Type', 'text/html; charset=utf-8');
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
    return response;
  },
};
