'use strict';
const { encrypt, decrypt } = require('../../../../utils/encryption');

const SENSITIVE_FIELDS = [
  'clientId',
  'clientSecret',
  'refreshToken',
  'accessToken',
  'developerToken',
];

module.exports = {
  beforeCreate(event) {
    const data = event.params.data;
    SENSITIVE_FIELDS.forEach(field => {
      if (data[field]) data[field] = encrypt(data[field]);
    });
  },

  beforeUpdate(event) {
    const data = event.params.data;
    SENSITIVE_FIELDS.forEach(field => {
      if (data[field]) data[field] = encrypt(data[field]);
    });
  },

  afterFind(event) {
    if (!event.result) return;
    const decryptFields = (record) => {
      SENSITIVE_FIELDS.forEach(field => {
        if (record[field]) record[field] = decrypt(record[field]);
      });
    };

    if (Array.isArray(event.result)) {
      event.result.forEach(decryptFields);
    } else {
      decryptFields(event.result);
    }
  },
};
