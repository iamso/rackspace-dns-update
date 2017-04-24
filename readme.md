# rackspace-dns-update
Update/create DNS records on Rackspace Cloud DNS.
If you run a node app on a host with dynamic ip or frequently change the host, you can include this package to automatically update the DNS record in Rackspace Cloud DNS. If there is no A record with the specified record name, it will be created.

## Usage

### Using environment variables

Set the following environment variables:

```bash
RACKSPACE_USER=username
# your rackspace username

RACKSPACE_API_KEY=key
# your rackspace api key

RACKSPACE_DOMAIN=domain.tld
# the name of the domain

RACKSPACE_RECORD=sub.domain.tld
# the name of the record to update/create. this is OPTIONAL, will be substituted
# with the domainname if not provided
```

And include the module:

```javascript
const updateDNS = require('rackspace-dns-update');

updateDNS();
// this will update the DNS record every 15 minutes

updateDNS(5 * 60 * 1000);
// this will update the DNS record every 5 minutes

updateDNS(0);
// this will only update the DNS record once
```

### Using function arguments

Include the module and pass the following arguments:

And include the module:

```javascript
const updateDNS = require('rackspace-dns-update');

updateDNS(
  null,
  'username',
  'key',
  'domain.tld',
  'sub.domain.tld' // this is OPTIONAL
);
// this will update the DNS record every 15 minutes

updateDNS(
  5 * 60 * 1000,
  'username',
  'key',
  'domain.tld',
  'sub.domain.tld' // this is OPTIONAL
);
// this will update the DNS record every 5 minutes

updateDNS(
  0,
  'username',
  'key',
  'domain.tld',
  'sub.domain.tld' // this is OPTIONAL
);
// this will only update the DNS record once
```


## License

[MIT License](LICENSE)
