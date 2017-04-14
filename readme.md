# rackspace-dns-update
Update/create DNS records on Rackspace Cloud DNS.
If you run a node app on a host with dynamic ip or frequently change the host, you can include this package to automatically update the DNS record in Rackspace Cloud DNS. If there is no A record with the specified record name, it will be created.

## Usage

The updater needs the following environment variables to work:

```bash
RACKSPACE_USER=username
# your rackspace username

RACKSPACE_API_KEY=key
# your rackspace api key

RACKSPACE_DOMAIN=domain.tld
# the name of the domain

RACKSPACE_RECORD=sub.domain.tld
# the name of the record to update/create. this is optional, will be substituted with the domainname if not provided
```

Use the updater as follows:

```javascript
const updateDNS = require('rackspace-dns-update');

updateDNS();
// this will update the DNS record every 15 minutes

updateDNS(5 * 60 * 1000);
// this will update the DNS record every 5 minutes

updateDNS(0);
// this will only update the DNS record once
```

## License

[MIT License](LICENSE)
