'use strict';

const http = require('http');
const https = require('https');
const methods = {};

['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].forEach(method => {
  methods[method] = (url, data, headers) => {
    return request(url, method, data, headers);
  };
});

function request(url = '', method = 'get', data = '', headers = {}) {
  return new Promise((resolve, reject) => {

    const port = /^https:\/\//.test(url) ? 443 : 80
    const [host, ...path] = url.replace(/^https?:\/\//, '').split('/');
    const options = {
      host: host,
      port: port,
      path: `/${path.join('/')}`,
      method: method.toUpperCase(),
      headers: Object.assign({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data = data ? JSON.stringify(data) : ''),
      }, headers),
    };

    const req = (port === 80 ? http : https).request(options, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        let data;
        try {
          data = JSON.parse(body);
        }
        catch(e) {
          data = body;
        };
        resolve(data);
      });
    }).on('error', error => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

module.exports = methods;
