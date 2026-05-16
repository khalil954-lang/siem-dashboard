const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/wazuh-alerts-4.x-*/_search",
    createProxyMiddleware({
      target: "https://192.168.56.101:9200",
      changeOrigin: true,
      secure: false, // ignore self-signed cert
      onProxyRes: function(proxyRes){
        delete proxyRes.headers['www-authenticate']; // prevent 401 prompts in browser
      }
    })
  );
  app.use(
    "/security/user/authenticate",
    createProxyMiddleware({
      target: "https://192.168.56.101:55000",
      changeOrigin: true,
      secure: false, // ignore self-signed cert
      onProxyRes: function(proxyRes){
        delete proxyRes.headers['www-authenticate']; // prevent 401 prompts in browser
      }
    })
  );
  app.use(
    "/agents",
    createProxyMiddleware({
      target: "https://192.168.56.101:55000",
      changeOrigin: true,
      secure: false, // ignore self-signed cert
      onProxyRes: function(proxyRes){
        delete proxyRes.headers['www-authenticate']; // prevent 401 prompts in browser
      }
    })
  );
};
