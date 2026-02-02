export async function onRequest(context) {
  try {
    // Try to fetch the requested asset
    return await context.next();
  } catch (err) {
    // If asset doesn't exist (404), serve index.html for SPA routing
    const url = new URL(context.request.url);

    // Don't handle API routes or specific extensions
    if (url.pathname.startsWith('/api/') ||
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|json|woff|woff2|ttf|eot|mp4|webm)$/)) {
      return context.next();
    }

    // Serve index.html for all other routes (SPA routing)
    return context.env.ASSETS.fetch(new URL('/index.html', url.origin));
  }
}
