'use strict';

const fs = require('fs');
const path = require('path');
const env = require('node-env-file');
const request = require('./lib/request');
const envFile = path.join(path.dirname(require.main.filename),'.env');

if (fs.existsSync(envFile)) {
  env(envFile);
}

const domain = process.env.RACKSPACE_DOMAIN;
const record = process.env.RACKSPACE_RECORD || domain;

const user = process.env.RACKSPACE_USER;
const key = process.env.RACKSPACE_API_KEY;

const identityAuth = {
  auth: {
    "RAX-KSKEY:apiKeyCredentials": {
      username: user,
      apiKey: key,
    }
  }
};

const identityApi = 'https://identity.api.rackspacecloud.com/v2.0/tokens';
const dnsApi = 'https://dns.api.rackspacecloud.com/v1.0/';
let domainApi;
let recordApi;

let dnsAuth;
let apiAccount;
let apiToken;
let ip;
let domainId;
let recordId;

function update() {
  request.get('https://req.dev.so')
    .then(data => {
      ip = data.http.ip;

      if (apiAccount && apiToken) {
        return Promise.resolve();
      }

      return request.post(identityApi, identityAuth);
    })
    .then(data => {

      if (domainId) {
        return Promise.resolve();
      }

      try {
        apiAccount = data.access.token.tenant.id;
        apiToken = data.access.token.id;
        dnsAuth = {
          'X-Auth-Token': apiToken
        };
      }
      catch(e) {
        return Promise.reject(new Error('Invalid credentials'));
      }

      domainApi = `${dnsApi}${apiAccount}/domains/`;

      return request.get(domainApi, null, dnsAuth);
    })
    .then(data => {

      if (!recordApi) {
        try {
          domainId = data.domains.filter(item => {
            return item.name === domain;
          })[0].id;
        }
        catch(e) {
          return Promise.reject(new Error('Domain doesn\'t exist'));
        }

        recordApi = `${domainApi}/${domainId}/records`;
      }

      return request.get(`${recordApi}?name=${record}&type=A`, null, dnsAuth);
    })
    .then(data => {
      if (data.records.length) {
        recordId = data.records[0].id;

        if (data.records[0].data === ip) {
          return Promise.resolve(data.records[0]);
        }

        return request.put(`${recordApi}`, {records: [{id: recordId, data: ip, comment: new Date()}]}, dnsAuth);
      }
      else {
        return request.post(`${recordApi}`, {records: [{name: record, type: 'A', data: ip, comment: new Date()}]}, dnsAuth);
      }
    })
    .then(data => {
      console.log(data);
    })
    .catch(console.error);

}

module.exports = (time = 15 * 60 * 1000) => {
  if (domain && record && user && key) {
    update();
    if (time) {
      return setInterval(update, time);
    }
  }
  else {
    console.error(new Error('Data incomplete'));
  }
};
