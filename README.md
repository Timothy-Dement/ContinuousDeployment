# Pipeline Project

Team Members:

* Kanchan Bisht (kbisht)
* Priyanka Jain (pjain15)
* Sourabh Saha (sssaha2)
* Timothy Dement (tmdement)

## Monitoring using New Relic
### What is New Relic?
* New Relic is a software analytics and application performance management solution that gives users in-depth data visibility and analytics. 
* By going right to the source, the code, New Relic enables users to develop quicker software, build improved products,and consistently impress their customers. Data tells a story and New Relic interprets what it is telling you.
* New Relic's Application Monitoring tool or APM, provides us with detailed performance metrics for every aspect of our environment
* It's features are
  * Flexible. Scalable. Powerful. With seamless setup that takes mere minutes.
  * View app performance down to specific lines of code, see how each component is connected
  * Full-stack alerting
  * SOC 2 audited and very good data security protocols in place
 ### How to setup new relic?
 * Since we have a NodeJS project (checkbox.io), we selected the NodeJS APM from selection options
 * Inside the root directory of our project (`server-side/site/`), we run `npm install newrelic`
 * Then we copy `newrelic.js` file from `node_modules/newrelic/` to the root directory of our project
 * We add the line `require('newrelic');` to the top of the `server.js` file
 * We also add a license key provided by New Relic to the `newrelic.js` file
 * Finally, we deploy the application and within a few minutes we start getting detailed information about the calls/routes/transctions between database and the server
