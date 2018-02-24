# Pipeline Project

[&#8592; MASTER BRANCH](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT)

Latest code can be found [here](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/tree/cm%2Bbuild/boxes/share)

# Team Members:

* Kanchan Bisht (kbisht)
* Priyanka Jain (pjain15)
* Sourabh Saha (sssaha2)
* Timothy Dement (tmdement)

# Configuration and Build Milestone

## Jenkins Set-up
Jenkins is a continuous integration tool used to automate the software pipeline from building, testing and deployment.

There were two options to install jenkins-
1. One was through the OS’s package manager
2. One was through the downloading and installing from a JAVA Archive (jar)

Installation through the package manager was fairly easy. The first major hurdle we faced was to bypass the initial admin setup. 
Jenkins requires us to pass a temporary token to a textbox to enable the admin login and create an admin user. But our goal was to automate Jenkins installation process so we had to do this initial admin user setup through code

The process that we used is as follows:
1. We wrote a groovy script, which sets up the admin user, as a template in ansible
2. We created a directory in `/var/lib/jenkins/` called `init.groovy.d/` .This directory is searched automatically by Jenkins on startup and all scripts inside this directory are executed
3. We also add `JAVA_ARGS="-Djava.awt.headless=true -Djenkins.install.runSetupWizard=false"` to bypass the initial setup wizard

We also needed the Jenkins API token for the admin user in order to automate build starts through the REST api
1. We first log the token using a groovy script
2. Then we use the `grep` tool to read through the logs in `/var/log/jenkins/jenkins.log` and retrieve the API token and store it as a variable in `/etc/environment`
3. The security issue is avoided as only a person with root privileges is allowed to access the logs

We execute post-build task using the post build task plugin which allows us to execute scripts after a build is successful
In order to install the plugin we use the `jenkins-plugin` module from ansible

## Jenkins job builder
Jenkins Job Builder is an Openstack developed tool for Jenkins to automate the creation of jobs using job templates and `YAML` files. It is a python `pip` package installed through the pip module in ansible

In order to setup Jenkins Job Builder we needed to go through multiple steps
1. We created a `jenkins_jobs.ini` configuration file with the user and API token set in it
2. We got this API token from the environment variable set in jenkins installation step
3. After that we created a job template which was used by a project to create multiple jobs having similar setup and similar requirements

A minor problem that we ran into was that when a plugin is installed we needed to restart Jenkins in order for the plugin to take effect. 

## iTrust2
iTrust2 is a java application used in the undergrad software engineering system. It uses enterprise Java technology. It has a rich set of unit tests.

To set it up, we first need valid github.ncsu credentials. Then we install maven and git. We need to set a Oracle java repository and accept the Java license (terms and conditions for usage) before installing Java. After that we clone the Itrust repository and install MySQL server. We create (by copying template files) the db.properties, email.properties and hibernate.properties files. Then, restart MySQL. After this we execute the following mvn commands:
'mvn clean test verify checkstyle:checkstyle' runs the unit tests, launches the server, runs the integration tests, and then brings the server back down. It verifies successful maven build;
'mvn process-test-classes' builds the database and creates sample data;
'mvn jetty:run' launches the server.
After executing all these commands you'll be able to see iTrust2 up and running at <ec2_instance IP address>:8080/iTrust2.

#### Challenges:
We had initially used vars_prompt for getting the github.ncsu credentials required for cloning repository from github.ncsu, later we switched to using environment variables to automate this task as well.
Using a custom password for MySQL was pretty challenging as we were running into accessibility issues on running mvn commands later. We resolved this issue by installing MySQL with default credentials, that is, user as root and password as blank.
Also we needed to insert multiple lines in the configuration file my.cnf for MySQL. Creating separate tasks for each line was time consuming and redundant. So we replace the automatically generated my.cnf file with another one. You will have access to this file when you clone this repository. It is difficult to globally update the MySQL credentials otherwise.
The ec2 instance was running out of memory while executing mvn jetty:run command. It took us a while to figure out that the issue was because of lack of available memory. We were initially thinking that the port is not reachable. The playbook was executing smoothly, without any error but we were unable to see the app running at port 8080. We tried various measures to fix the issue how we thought it to be. But, then we found out, by manually running the mvn commands on the ec2 instance after remote login (by ssh), that the issue was lack of available memory. The mvn jetty task was being killed before completion due to lack of memory. But, since there was no error, we were getting an ok status on running the ansible task. So, it was hard to figure out initially the cause of error. After figuring it out, we resolved it by creating a new ec2 instance with greater memory.

## Checkbox.io
checkbox.io is a site for hosting simple surveys created in markdown. It has dependencies on nginx, node, monogodb.

Firstly we need to set up the following environment variables: MONGO_PORT, MONGO_IP, MONGO_USER, MONGO_PASSWORD. Then we install git, node.js and npm. Then after adding MongoDB ppa key and sources list, we install MongoDB. Then after installing python-pip, nginx and pymongo, we clone the checkbox.io repository. Then we create a MongoDB user, set up environment variables. Next, we install packages specified in package.json. The configuration was set up by updating location of public_html into default and then placing them in the sites available in nginx. The conf file for nginx was placed at the correct location after which nginx is restarted. After which, the server.js is run using npm forever module. 

#### Challenges:
There was no ReadMe file available for setting up checkbox.io application, so it was difficult to figure out the exact tasks required.
We were not sure of the location where nginx should be installed. Incorrect placement was leading to errors.
Setting up the correct version of MongoDB was challenging as we were initially using a xenial ec2 instance in which mongodb/init was not being created. We figured out that we needed MongoDB enterprise 3.6 in xenial. Even, after downloading that, we continued facing configuration errors with MongoDB. We did not face any such issues while using trusty64 image. More information about this issue can be found using this [link](https://docs.mongodb.com/getting-started/shell/tutorial/install-mongodb-on-ubuntu/).

## Integration
The integration of the entire build pipeline was done using post-build tasks. We used the postbuild-task plugin of jenkins, which allowed us to execute shell scripts after the build job is complete. The post-build tasks provisioned the EC2 instance on which to deploy the app and then ran an ansible play book to automatically build and run the application on the newly created VM

## Contributions:
* Kanchan Bisht(kbisht): Setting up iTrust2 application after successful post-build job.
* Priyanka Jain (pjain15): Setting up checkbox.io application after successful post-build job.
* Sourabh Saha (sssaha2) and Timothy Dement (tmdement): Automated provisioning of EC2 instances and automation of jenkins and jenkins-jobs from job templates and post-build scripts 

## Screencast
You can see the demo of the project in this [Screencast]()