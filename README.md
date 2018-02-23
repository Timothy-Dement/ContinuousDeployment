# Pipeline Project

[&#8592; MASTER BRANCH](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT)

Team Members:

* Kanchan Bisht (kbisht)
* Priyanka Jain (pjain15)
* Sourabh Saha (sssaha2)
* Timothy Dement (tmdement)

# Configuration and Build Milestone

## Jenkins Set-up
Jenkins is a continuous integration tool used to automate the software pipeline from building testing and deployment
There were two options to install jenkins

1. One was through the OS’s package manager
2. One was through the downloading and installing from a JAVA Archive (jar)

Installation through the package manager was fairly easy. The first major hurdle we faced was to bypass the initial admin setup
Jenkins requires us to pass a temporary token to a textbox to enable the admin login and create an admin user. But our goal was to automate Jenkins installation process so we had to do this initial admin user setup through code

The process that we used is as follows:
1. We wrote a groovy [script](), which sets up the admin user, as a template in ansible
2. We create a directory in `/var/lib/jenkins/` called `init.groovy.d/` .This directory is searched automatically by jenkins on start and all scripts inside this directory are executed
3. We also add `JAVA_ARGS="-Djava.awt.headless=true -Djenkins.install.runSetupWizard=false"` to bypass the initial setup wizard

We also need the Jenkins api token for the admin user in order to automate build starts through the REST api
1. We first log the token using a groovy [script]()
2. Then we use the `grep` tool to read through the logs in `/var/log/jenkins/jenkins.log` and retrieve the api token and store it as a variable in `/etc/environment`
3. The security issue is avoided as only a person with root privileges is allowed to access the logs

We execute post-build task using the post build task plugin which allows us to execute scripts after a build is successful
In order to install the plugin we use the ‘jenkins-plugin’ module from ansible

## Jenkins job builder
Jenkins Job Builder is an openstack-developed tool for Jenkins to automate the creation of jobs using job templates and `YAML` files. It is a python `pip` package installed through the pip module in ansible

In order to setup Jenkins Job Builder we needed to go through multiple steps
1. We created a `jenkins_jobs.ini` configuration file with the user and API token set in it
2. We got this API token from the environment variable set in jenkins installation step
3. After that we created a job template which was used by a project to create multiple jobs having similar setup and similar requirements

A minor problem that we ran into was that when a plugin is installed we needed to restart jenkins in order for the plugin to take effect.Secondly, from jenkins 2.x, CSRF has been enabled by default. 
