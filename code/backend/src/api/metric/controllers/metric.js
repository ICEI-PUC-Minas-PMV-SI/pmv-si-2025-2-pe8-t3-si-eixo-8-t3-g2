'use strict'


module.exports = {
async syncData(ctx) {
try {
// call service methods that fetch from Google and Meta
const googleRows = await strapi.service('api::metric.adapter').fetchGoogleAds();
const metaRows = await strapi.service('api::metric.adapter').fetchMetaAds();


const rows = [...googleRows, ...metaRows];


// upsert/save rows to Metric collection
for (const r of rows) {
await strapi.db.query('api::metric.metric').create({ data: r });
}


ctx.send({ message: 'Synced', count: rows.length });
} catch (err) {
ctx.throw(500, err.message);
}
},
}