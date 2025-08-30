const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/itunes',
    createProxyMiddleware({
      target: 'https://itunes.apple.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/itunes': '',
      },
    })
  );
};