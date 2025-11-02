module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/ads-fetcher/demographics/:clientId',
      handler: 'demographics.getAgeGender',
      config: { auth: false }
    }
  ]
}
