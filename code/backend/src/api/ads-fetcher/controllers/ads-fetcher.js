'use strict';

module.exports = {
  async syncAll(ctx) {
    // Only admin should be allowed; route config enforces that.
    await strapi.service('api::ads-fetcher.ads-fetcher').fetchAllAccounts();
    ctx.send({ ok: true, message: 'All accounts synced successfully' });
  },

  async syncClient(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('You must be logged in');

    const client = await strapi.db.query('api::client.client').findOne({
      where: { user: user.id },
      populate: ['adAccounts'],
    });

    if (!client) return ctx.unauthorized('Client not found or not linked to your user');

    const fetcher = strapi.service('api::ads-fetcher.ads-fetcher');
    for (const acc of client.adAccounts) {
      if (acc.platform === 'google') await fetcher.fetchGoogleAds(acc);
      else if (acc.platform === 'meta') await fetcher.fetchMetaAds(acc);
    }

    ctx.send({ ok: true, message: 'Client accounts synced successfully' });
  },
};
