'use strict';

module.exports = {
  async getMetrics(ctx) {
    const { clientId } = ctx.params;
    const data = await strapi.service('api::ads-fetcher.metrics').getAllMetrics(clientId);
    ctx.send(data);
  },
};
