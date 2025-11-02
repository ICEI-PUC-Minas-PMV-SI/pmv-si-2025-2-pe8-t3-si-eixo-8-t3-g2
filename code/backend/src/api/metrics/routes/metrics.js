module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/ads-fetcher/metrics/:clientId',
      handler: 'metrics.getMetrics',
      config: { auth: false }, // restrict in production
    },
  ],
};
