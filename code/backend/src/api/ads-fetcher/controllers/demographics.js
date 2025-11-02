'use strict'

module.exports = {
  async getAgeGender(ctx) {
    const { clientId } = ctx.params
    const svc = strapi.service('api::ads-fetcher.demographics')

    const [age, gender] = await Promise.all([
      svc.getAgeDistribution(clientId),
      svc.getGenderDistribution(clientId)
    ])

    ctx.send({ age, gender })
  }
}
