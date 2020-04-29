const express = require('express');
const got = require('got');

const app = express();

// Location of the standard EC2 metadata service
const metadataServiceURL = 'http://169.254.169.254/latest/meta-data';

app.get('/', (req, res) => {
  // Serve the steaming pie
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head><meta charset="utf-8"></head>
  <body>
    <p>Four and twenty blackbirds</p>
  </body>
</html>`);
});

// Proxy the instance type from the AWS metadata service
app.get('/kitchen', (req, res) => {
  // Request the data as a set of parallel HTTP requests
  Promise.all([
    got(`${metadataServiceURL}/instance-type`).then((metadataRes) => {
      return metadataRes.body;
    }),
    got(`${metadataServiceURL}/public-hostname`).then((metadataRes) => {
      return metadataRes.body;
    }),
    got(`${metadataServiceURL}/placement/availability-zone`).then(
      (metadataRes) => {
        return metadataRes.body;
      },
    ),
  ])
    .then(([type, hostname, placement]) => {
      res.send({ type, hostname, placement });
    })
    .catch((err) => {
      res.send('No Show');
    });
});

app.get('/health', (req, res) => {
  // respond to a health check ping
  res.send('OK');
});

module.exports = app;
