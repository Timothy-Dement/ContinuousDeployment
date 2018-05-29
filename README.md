# Pipeline Project

| **Team Members** |
| :--- |
| Kanchan Bisht (kbisht) |
| Priyanka Jain (pjain15) |
| Sourabh Saha (sssaha2) |
| Timothy Dement (tmdement) |

[&#8592; MASTER BRANCH](https://github.com/Timothy-Dement/ContinuousDeployment/tree/master)

# Configuration and Build Milestone

## 1.1. Jenkins Set-up

**RELEVANT FILES:**

* [`provisioners/aws-jenkins.js`](provisioners/aws-jenkins.js)
* [`playbooks/jenkins.yml`](playbooks/jenkins.yml)
* [`templates/configure-users.groovy`](templates/configure-users.groovy)
* [`vars/main.yml`](vars/main.yml)

Jenkins is a continuous integration tool used to automate the software pipeline from building, testing and deployment.

There were two options to install Jenkins:

1. One was through the OS’s package manager
2. One was through the downloading and installing from a JAVA Archive (jar)

Installation through the package manager was fairly easy. The first major hurdle we faced was to bypass the initial admin setup through the setup wizard.

By adding values to the `etc/default/jenkins` file (specifically, `JAVA_ARGS="-Djava.awt.headless=true -Djenkins.install.runSetupWizard=false`), we were able to turn off the setup wizard, but then had to find some way to create an admin otherwise.

The process that we used is as follows:

1. We wrote a groovy script, which sets up the admin user, and used it as an Ansible template.

2. We created a directory in `/var/lib/jenkins/` called `init.groovy.d/`. This directory is searched automatically by Jenkins on startup and all scripts inside this directory are executed.

3. During execution of the Ansible playbook, we copied our groovy scripts to this directory, and then restarted Ansible.

By passing environment values for our Jenkins username and password, we were able to provide later authentication for plugin installations, build triggers, and other tasks.

We execute post-build task using the post build task plugin which allows us to execute scripts after a build is successful. In order to install the plugin we use the `jenkins-plugin` module from Ansible.

Another challenge was researching how to properly retrieve the "crumb" for triggering a Jenkins build programmatically, which we were eventually able to achieve through using Ansible's `uri` module.

## 1.2. Jenkins Job Builder

**RELEVANT FILES:**

* [`templates/jenkins_jobs.ini`](templates/jenkins_jobs.ini)
* [`templates/defaults.yml`](templates/defaults.yml)
* [`templates/projects.yml`](templates/projects.yml)
* [`templates/test.yml`](templates/test.yml)

Jenkins Job Builder is an Openstack developed tool for Jenkins to automate the creation of jobs using job templates and `YAML` files. It is a python `pip` package installed through the pip module in Ansible.

In order to set up Jenkins Job Builder we needed to go through multiple steps:

1. We created a `jenkins_jobs.ini` configuration file with the appropriate username and password set in it.

2. After that we created a job template which was used by a project to create multiple jobs having similar setup and similar requirements.

A minor problem that we ran into was that when a plugin is installed we needed to restart Jenkins in order for the plugin to take effect.

## 2. iTrust2

**RELEVANT FILES:**

* [provisioners/aws-itrust.js](provisioners/aws-itrust.js)
* [playbooks/itrust.yml](playbooks/itrust.yml)
* [templates/my.cnf](templates/my.cnf)

iTrust2 is a Java application used in the undergrad software engineering system. It uses enterprise Java technology. It has a rich set of unit tests.

To set it up, we first need valid github.ncsu credentials. Then we installed maven and git. We needed to set an Oracle Java repository and accept the Java license (terms and conditions for usage) before installing Java. After that we cloned the iTrust repository and installed MySQL server. We created (by copying template files) the `db.properties`, `email.properties` and `hibernate.properties` files. Then, we restarted MySQL. After this, we executeed the following `mvn` commands:

* `mvn clean test verify checkstyle:checkstyle` runs the unit tests, launches the server, runs the integration tests, and then brings the server back down. It verifies successful maven build.

* `mvn process-test-classes` builds the database and creates sample data.

* `mvn jetty:run` launches the server.

After executing all these commands you'll be able to see iTrust2 up and running at `< ec2_instance IP address >:8080/iTrust2`.

#### Challenges:

We had initially used vars_prompt for getting the github.ncsu credentials required for cloning repository from github.ncsu, later we switched to using environment variables to automate this task as well.

Using a custom password for MySQL was pretty challenging as we were running into accessibility issues on running `mvn` commands later. We resolved this issue by installing MySQL with default credentials, that is, user as root and password as blank.
Also we needed to insert multiple lines in the configuration file `my.cnf` for MySQL. Creating separate tasks for each line was time consuming and redundant. So we replace the automatically generated `my.cnf` file with another one. You will have access to this file when you clone this repository. It is difficult to globally update the MySQL credentials otherwise.

The EC2 instance was running out of memory while executing `mvn jetty:run command`. It took us a while to figure out that the issue was because of lack of available memory. We were initially thinking that the port is not reachable. The playbook was executing smoothly, without any error but we were unable to see the app running at port 8080. We tried various measures to fix the issue how we thought it to be. But, then we found out, by manually running the `mvn` commands on the EC2 instance after remote login (by ssh), that the issue was lack of available memory. The `mvn jetty` task was being killed before completion due to lack of memory. But, since there was no error, we were getting an ok status on running the Ansible task. So, it was hard to figure out initially the cause of error. After figuring it out, we resolved it by creating a new EC2 instance with greater memory.

## 3. Checkbox.io

**RELEVANT FILES:**

* [provisioners/aws-checkbox-trusty.js](provisioners/aws-checkbox-trusty.js)
* [playbooks/checkbox.yml](playbooks/checkbox.yml)

checkbox.io is a site for hosting simple surveys created in markdown. It has dependencies on nginx, node, monogodb.

First we need to set up the following environment variables: `MONGO_PORT`, `MONGO_IP`, `MONGO_USER`, `MONGO_PASSWORD`. Then we installed git, node.js and npm. Then after adding MongoDB ppa key and sources list, we install MongoDB. Then after installing python-pip, nginx and pymongo, we clone the checkbox.io repository. Then we create a MongoDB user and set up environment variables. Next, we install packages specified in package.json. The configuration was set up by updating location of public_html into default and then placing them in the sites available in nginx. The conf file for nginx was placed at the correct location after which nginx is restarted. After which, the server.js was run using the npm forever module. 

#### Challenges:

There was no README file available for setting up checkbox.io application, so it was difficult to figure out the exact tasks required. We were not sure of the location where nginx should be installed. Incorrect placement was leading to errors.

Setting up the correct version of MongoDB was challenging as we were initially using a xenial EC2 instance in which `mongodb/init` was not being created. We figured out that we needed MongoDB enterprise 3.6 in xenial. Even after downloading that, we continued facing configuration errors with MongoDB. We did not face any such issues while using trusty64 image, so we decided to provision a trusty EC2 instance instead. More information about this issue can be found [here](https://docs.mongodb.com/getting-started/shell/tutorial/install-mongodb-on-ubuntu/).

## 4. Integration

The integration of the entire build pipeline was done using post-build tasks. We used the postbuild-task plugin of jenkins, which allowed us to execute shell scripts after the build job is complete. The post-build tasks provisioned the EC2 instance on which to deploy the app and then ran an Ansible playbook to automatically built and ran the application on the newly created VM.

#### Challenges:

Some of the general challenges we faced often had to do with code behaving differently on our EC2 instances than it did on local virtual machines. Sometimes this was due to security policies and ports, and other times it was due to the differences in versions of the dependencies that were downloaded by default in each case. As described above, we had a "phantom" problem (due to low-memory instances) that was not giving us any valuable feedback on what could be causing the problem. This took us quite some time to discover.

One particularly unexpected problem arose when configuring our remote Jenkins EC2 instance. On our first attempt, we had somehow disabled the CSRF protection measures that are by default enabled. Since they were disabled, we had no trouble triggering builds without using the "crumb". However, when it came time to make the screencast on a fresh EC2 instance, the CSRF was enabled, and we were no longer able to trigger builds in the same manner. After researching for awhile, we discovered a solution, and added to and revised the final few tasks in our playbook.

## 5. Contributions

* Kanchan Bisht(kbisht): Setting up iTrust2 application after successful post-build job.
* Priyanka Jain (pjain15): Setting up checkbox.io application after successful post-build job.
* Sourabh Saha (sssaha2) and Timothy Dement (tmdement): Automated provisioning of EC2 instances and automation of jenkins and jenkins-jobs from job templates and post-build scripts.

## 6. Screencast

Please watch the screencast linked to from the image below, which demonstrates the full execution path of our pipeline from scratch.

[![Milestone One Screencast](https://img.youtube.com/vi/fmb8PFrzfFc/0.jpg)](https://youtu.be/fmb8PFrzfFc)

## 7. Testing

This project was organized such that it could be easily replicated in order to demonstrate proper functionality. The following are the prerequisites and steps for testing our code base.

#### Prerequisites

The following environment variables must be set on the local machine before running the `vagrant up` command:

* `GITHUB_USERNAME` — *NCSU Enterprise*
* `GITHUB_PASSWORD` — *NCSU Enterprise*
* `AWS_ACCESS_KEY_ID` — *must be valid*
* `AWS_SECRET_ACCESS_KEY` — *must be valid*
* `JENKINS_USERNAME` — *any valid string*
* `JENKINS_PASSWORD` — *any valid string*

Vagrant must be installed on the local machine as well.

The following two AWS subscriptions are also required for proper execution of the EC2 provisioning code:

* Ubuntu Server 14.04 LTS (HVM) — `ami-071c247d`
* Ubuntu 16.04 LTS - Xenial (HVM) — `ami-dc2d10a6`

#### Steps

---

**I.** In any location on your local machine, create the simple directory structure:

```shell

	mkdir boxes
	mkdir boxes/ansible
	mkdir boxes/share
	cd boxes/ansible
  
```

---

**II.** Copy the [`Vagrantfile`](Vagrantfile) to `boxes/ansible`.

---

**III.** From `boxes/ansible`, provision and connect to the Vagrant VM:

```shell

	vagrant up # wait for termination...
	vagrant ssh
	
```

---

**IV.** Provision the EC2 instance for Jenkins:

```shell

	nodejs provisioners/aws-jenkins.js
	
```

---

**V.** When the previous step terminates, configure the Jenkins server:

```shell

	ansible-playbook playbooks/jenkins.yml -i inventory
	
```

The final task of this playbook will trigger build jobs for checkbox.io and iTrust, which (when successful) will subsequently provision and configure two additional EC2 instances.

---

**VI.** Access your Jenkins server at `< jenkins-ip >:8080` with the username and password you originally set as environment variables. This IP address is available from the Ansible output in Step V.

Access the start page of checkbox.io at `< checkbox-ip >` and the start page of itrust at `< itrust-ip >:8080/iTrust2`. These IP addresses are available from the post-build task output on the Jenkins server during Step V.
