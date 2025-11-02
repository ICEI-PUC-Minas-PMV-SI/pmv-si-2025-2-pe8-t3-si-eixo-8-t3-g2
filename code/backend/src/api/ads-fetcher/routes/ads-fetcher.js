module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/ads-fetcher/sync-all',
      handler: 'ads-fetcher.syncAll',
      config: {
        policies: [],
        auth: { scope: ['admin'] }
      }
    },
    {
      method: 'GET',
      path: '/ads-fetcher/sync-client',
      handler: 'ads-fetcher.syncClient',
      config: {
        policies: [],
        auth: true
      }
    }
  ]
};
