'use strict'

module.exports = ({ strapi }) => ({
  async getAgeDistribution(clientId) {
    const rows = await strapi.db.connection('demographics')
      .join('campaigns', 'demographics.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .select('demographics.ageRange')
      .sum('demographics.reach as reach')
      .groupBy('demographics.ageRange')
    return rows
  },

  async getGenderDistribution(clientId) {
    const rows = await strapi.db.connection('demographics')
      .join('campaigns', 'demographics.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .select('demographics.gender')
      .sum('demographics.reach as reach')
      .groupBy('demographics.gender')
    return rows
  }
})
