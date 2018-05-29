# Pipeline Project

| **Team Member** | **Unity ID** | **Milestone Contribution** |
| :---: | :---: | :---: |
| Kanchan Bisht | kbisht | Screencast |
| Priyanka Jain | pjain15 | Screencast |
| Sourabh Saha | sssaha2 | New Relic<br/>Report |
| Timothy Dement | tmdement | Autorecover<br/>Screencast<br/>Report |

[&#8592; MASTER BRANCH](https://github.com/Timothy-Dement/ContinuousDeployment/tree/master)

## Screencast

**NOTE:** Please watch at 1.5 speed or higher to hit the 4-minute mark (we wanted to include sufficient information in the screencast in order to show it as part of our resumes).

[![Building a Continuous Deployment Pipeline](https://img.youtube.com/vi/aTZ-xmgezVw/0.jpg)](https://youtu.be/aTZ-xmgezVw)

## Automatic Recovery Tool

***Relevant Files:***

* [`tools/autorecover.js`](tools/autorecover.js)
* [`provisioners/do-checkbox-one.js`](provisioners/do-checkbox-one.js)
* [`playbooks/checkbox.yml`](playbooks/checkbox.yml)

---

The `autorecover.js` tool is a proof-of-concept tool that automatically provisions and configures a new Digital Ocean instance of the `checkbox.io` application if certain unresponsive thresholds are met during its monitoring of the other `checkbox.io` instances.

We updated the heartbeat monitor from the last milestone to trigger a countdown when one of the `checkbox.io` instances is unresponsive. If the threshold is reached, the tool will call a provisioning script to create a new Digital Ocean droplet, and then will configure `checkbox.io` on that droplet with the appropriate Ansible playbook.

The tool then halts, allowing the developer to investigate the failing droplet and remove it from the relevant inventory file if necessary.

## Monitoring with New Relic

***Relevant Files:***

* [`playbooks/checkbox.yml`](playbooks/checkbox.yml)
* [`templates/newrelic.js`](templates/newrelic.js)
* [`templates/server.js`](templates/server.js)

---

### What is New Relic?

* New Relic is a software analytics and application performance management solution that gives users in-depth data visibility and analytics.

* By going right to the source, the code, New Relic enables users to develop quicker software, build improved products,and consistently impress their customers. Data tells a story and New Relic interprets what it is telling you.

* New Relic's Application Monitoring tool or APM, provides us with detailed performance metrics for every aspect of our environment.

* New Relic's features are:

  * Flexible. Scalable. Powerful. With seamless setup that takes mere minutes.
  
  * View app performance down to specific lines of code, see how each component is connected.
  
  * Full-stack alerting.
  
  * SOC 2 audited and very good data security protocols in place.

### How to Set Up New Relic?

* Since we have a NodeJS project (checkbox.io), we selected the NodeJS APM from selection options.

* Inside the root directory of our project (`server-side/site/`), we run `npm install newrelic`.

* Then we copy `newrelic.js` file from `node_modules/newrelic/` to the root directory of our project.

* We add the line `require('newrelic');` to the top of the `server.js` file.

* We also add a license key provided by New Relic to the `newrelic.js` file.

* Finally, we deploy the application and within a few minutes we start getting detailed information about the calls/routes/transctions between database and the server.

* These tasks are automated in the `checkbox.yml` Ansible playbook.
