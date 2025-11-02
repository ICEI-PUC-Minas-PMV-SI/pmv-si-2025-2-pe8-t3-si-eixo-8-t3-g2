'use strict';

const { subMonths, startOfMonth, endOfMonth, subDays } = require('date-fns');

module.exports = ({ strapi }) => ({

  // Helper: generic aggregation
  async sumMetric(metric, where = {}) {
    const results = await strapi.db.connection('performances')
      .where(where)
      .sum(metric, { as: 'total' })
      .first();
    return Number(results?.total || 0);
  },

  // Accounts reached in last 5 months
  async getAccountsReachedLast5Months(clientId) {
    const fiveMonthsAgo = subMonths(new Date(), 5);
    const rows = await strapi.db.connection('performances')
      .join('campaigns', 'performances.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .andWhere('performances.date', '>=', fiveMonthsAgo)
      .sum('performances.reach as total')
      .first();
    return Number(rows?.total || 0);
  },

  // Impressions last month
  async getImpressionsLastMonth(clientId) {
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
    const rows = await strapi.db.connection('performances')
      .join('campaigns', 'performances.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .andWhereBetween('performances.date', [lastMonthStart, lastMonthEnd])
      .sum('performances.impressions as total')
      .first();
    return Number(rows?.total || 0);
  },

  // Engagement (likes, comments, shares)
  async getEngagements(clientId) {
    const result = await strapi.db.connection('performances')
      .join('campaigns', 'performances.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .sum('performances.engagements as total')
      .first();
    return Number(result?.total || 0);
  },

  // Followers gained in last 5 months
  async getFollowersGained(clientId) {
    const fiveMonthsAgo = subMonths(new Date(), 5);
    const rows = await strapi.db.connection('performances')
      .join('campaigns', 'performances.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .andWhere('performances.date', '>=', fiveMonthsAgo)
      .sum('performances.followersGained as total')
      .first();
    return Number(rows?.total || 0);
  },

  // Leads generated in last 30 days
  async getLeadsLast30Days(clientId) {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const result = await strapi.db.connection('performances')
      .join('campaigns', 'performances.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .andWhere('performances.date', '>=', thirtyDaysAgo)
      .sum('performances.leads as total')
      .first();
    return Number(result?.total || 0);
  },

  // Cost per 1,000 impressions (CPM)
  async getCPM(clientId) {
    const { sum: spend } = await strapi.db.connection('performances')
      .join('campaigns', 'performances.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .sum('performances.spend as spend')
      .first() || { sum: 0 };

    const { sum: impressions } = await strapi.db.connection('performances')
      .join('campaigns', 'performances.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .sum('performances.impressions as impressions')
      .first() || { sum: 0 };

    return impressions > 0 ? (spend / impressions) * 1000 : 0;
  },

  // CTR = clicks / impressions
  async getCTR(clientId) {
    const result = await strapi.db.connection('performances')
      .join('campaigns', 'performances.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .sum('performances.clicks as clicks')
      .sum('performances.impressions as impressions')
      .first();
    const { clicks, impressions } = result;
    return impressions > 0 ? (clicks / impressions) * 100 : 0;
  },

  // Total spend for entire campaign
  async getTotalSpend(clientId) {
    const result = await strapi.db.connection('performances')
      .join('campaigns', 'performances.campaign_id', 'campaigns.id')
      .join('ad_accounts', 'campaigns.ad_account_id', 'ad_accounts.id')
      .where('ad_accounts.client_id', clientId)
      .sum('performances.spend as total')
      .first();
    return Number(result?.total || 0);
  },

  // Cost per message (assume message metric = leads)
  async getCostPerMessage(clientId) {
    const spend = await this.getTotalSpend(clientId);
    const leads = await this.getLeadsLast30Days(clientId);
    return leads > 0 ? spend / leads : 0;
  },

  // Combined metrics object
  async getAllMetrics(clientId) {
    return {
      accountsReachedLast5Months: await this.getAccountsReachedLast5Months(clientId),
      impressionsLastMonth: await this.getImpressionsLastMonth(clientId),
      engagements: await this.getEngagements(clientId),
      followersGained: await this.getFollowersGained(clientId),
      leadsLast30Days: await this.getLeadsLast30Days(clientId),
      CPM: await this.getCPM(clientId),
      CTR: await this.getCTR(clientId),
      totalSpend: await this.getTotalSpend(clientId),
      costPerMessage: await this.getCostPerMessage(clientId),
    };
  },
});
