const options = {
  target: 'http://localhost:4000/', // target host
  ws: true, // proxy websockets
  pathRewrite: {
    '^/api': '', // rewrite path
  },
};

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware(
      options
    )
  );
};
