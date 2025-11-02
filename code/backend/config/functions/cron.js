module.exports = {
  '0 3 * * *': async ({ strapi }) => {
    strapi.log.info('Cron: Starting ads sync for all accounts');
    await strapi.service('api::ads-fetcher.ads-fetcher').fetchAllAccounts();
    strapi.log.info('Cron: Ads sync completed');
  },
};
