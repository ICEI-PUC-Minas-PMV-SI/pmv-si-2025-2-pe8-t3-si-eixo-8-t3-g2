'use strict';

const { GoogleAdsApi } = require('google-ads-api');
const bizSdk = require('facebook-nodejs-business-sdk');
const AdAccountFB = bizSdk.AdAccount;

module.exports = ({ strapi }) => ({

  async fetchAllAccounts() {
    const accounts = await strapi.db.query('api::ad-account.ad-account').findMany({
      where: { active: true },
      populate: ['client'],
    });

    for (const acc of accounts) {
      if (acc.platform === 'google') {
        await this.fetchGoogleAds(acc);
      } else if (acc.platform === 'meta') {
        await this.fetchMetaAds(acc);
      }
    }
  },

  async fetchGoogleAds(account) {
    try {
      const client = new GoogleAdsApi({
        client_id: account.clientId,
        client_secret: account.clientSecret,
        developer_token: account.developerToken,
      });

      const customer = client.Customer({
        customer_id: account.accountId,
        refresh_token: account.refreshToken,
      });

      const report = await customer.report({
        entity: 'campaign',
        attributes: ['campaign.id', 'campaign.name', 'campaign.status'],
        metrics: ['impressions', 'clicks', 'cost_micros', 'conversions'],
        date_constant: 'YESTERDAY',
      });

      for (const row of report) {
        // find campaign by externalId + adAccount
        const existing = await strapi.db.query('api::campaign.campaign').findOne({
          where: { externalId: row.campaign.id.toString(), platform: 'google', adAccount: account.id },
        });

        let campaignId;
        if (!existing) {
          const created = await strapi.db.query('api::campaign.campaign').create({
            data: {
              name: row.campaign.name,
              externalId: row.campaign.id.toString(),
              status: row.campaign.status,
              platform: 'google',
              adAccount: account.id,
              accountId: account.accountId,
            },
          });
          campaignId = created.id;
        } else {
          campaignId = existing.id;
        }

        const cost = Number(row.metrics.cost_micros) / 1_000_000;

        await strapi.db.query('api::performance.performance').create({
          data: {
            date: new Date(),
            impressions: row.metrics.impressions || 0,
            clicks: row.metrics.clicks || 0,
            spend: cost || 0,
            conversions: row.metrics.conversions || 0,
            campaign: campaignId,
          },
        });
      }

      strapi.log.info(`✅ Synced Google Ads for ${account.client?.name || account.accountId}`);
    } catch (err) {
      strapi.log.error(`❌ Google Ads fetch failed for ${account.client?.name || account.accountId}: ${err.message}`);
    }
  },

  async fetchMetaAds(account) {
    try {
      const fbAccount = new AdAccountFB(`act_${account.accountId}`);
      const campaigns = await fbAccount.getCampaigns(
        ['name', 'status', 'objective'],
        { access_token: account.accessToken }
      );

      for (const c of campaigns) {
        const existing = await strapi.db.query('api::campaign.campaign').findOne({
          where: { externalId: c.id, platform: 'meta', adAccount: account.id },
        });

        if (!existing) {
          await strapi.db.query('api::campaign.campaign').create({
            data: {
              name: c.name,
              externalId: c.id,
              status: c.status,
              objective: c.objective,
              platform: 'meta',
              adAccount: account.id,
              accountId: account.accountId,
            },
          });
        }
      }

      strapi.log.info(`✅ Synced Meta Ads for ${account.client?.name || account.accountId}`);
    } catch (err) {
      strapi.log.error(`❌ Meta Ads fetch failed for ${account.client?.name || account.accountId}: ${err.message}`);
    }
  },

});
