const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/wazuh-alerts-4.x-*/_search",
    createProxyMiddleware({
      target: "https://192.168.50.22:9200",
      changeOrigin: true,
      secure: false // ignore self-signed cert
    })
  );
  app.use(
    "/security/user/authenticate",
    createProxyMiddleware({
      target: "https://192.168.50.22:55000",
      changeOrigin: true,
      secure: false // ignore self-signed cert
    })
  );
  app.use(
    "/agents",
    createProxyMiddleware({
      target: "https://192.168.50.22:55000",
      changeOrigin: true,
      secure: false // ignore self-signed cert
    })
  );
};
