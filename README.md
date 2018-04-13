# Pipeline Project

| **Team Member** | **Milestone Contribution** |
| :--- | :--- |
| Kanchan Bisht (kbisht) | ... |
| Priyanka Jain (pjain15) | ... |
| Sourabh Saha (sssaha2) | ... |
| Timothy Dement (tmdement) | Jenkins Updates</br>Basic Deployment</br>Rolling Update<br/>Screencast</br> |

[&#8592; MASTER BRANCH](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT)

# Deployment Milestone

## Basic Deployment

***Relevant Files:***

* [`provisioners/aws-jenkins.js`](provisioners/aws-jenkins.js)
* [`playbooks/jenkins.yml`](playbooks/jenkins.yml)
* [`templates/checkbox-post-receive`](templates/checkbox-post-receive)
* [`templates/itrust-post-receive`](templates/itrust-post-receive)

---

The provisioning and configuration code for the Jenkins server has remained largely the same as that of the last milestone, with a few notable exceptions in the `jenkins.yml` playbook:

* The environment variables `MYSQL_DB_USER` and `MYSQL_DB_PASSWORD` are passed to the Jenkins server for use in the Rolling Update task.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/5a72b410b237e300dabdf7b414c31e9bd6af3b2f/playbooks/jenkins.yml#L58-L74)

* Copies of the `checkbox.io`, `iTrust2-v1`, `iTrust2-v2`, and `JenkinsDeploy` projects are cloned to the home directory of the Jenkins server. Packages for the `JenkinsDeploy` project are installed.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/5a72b410b237e300dabdf7b414c31e9bd6af3b2f/playbooks/jenkins.yml#L245-L259)

* A `deploy` directory structure is created following the structure of the workshop. It contains four sub-directories, `checkbox.git`, `checkbox-www`, `itrust.git`, and `itrust-www`, and bare git repositories are initializes in the `checkbox.git` and `itrust.git` sub-directories.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/5a72b410b237e300dabdf7b414c31e9bd6af3b2f/playbooks/jenkins.yml#L261-L278)

* Post-receive files that provision and configure the `checkbox.io` and `iTrust2-v1` projects are copied to the `hooks` directories of the respective git repositories.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/5a72b410b237e300dabdf7b414c31e9bd6af3b2f/playbooks/jenkins.yml#L280-L287)

* Git remotes are added to the `checkbox.io` and `iTrust2-v1` repositories in the home directory that point to the `checkbox.git` and `itrust.git` endpoints.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/5a72b410b237e300dabdf7b414c31e9bd6af3b2f/playbooks/jenkins.yml#L289-L297)

When the commands `git push checkbox master` and `git push itrust master` are run, the respective `post-receive` hooks provision and configure the `checkbox.io` and `iTrust2-v1` projects, as demonstrated in the **Screencast**.

## Infrastructure Upgrade

## Canary Release

## Rolling Update

***Relevant Files***:

* [`provisioners/aws-itrust-database.js`](provisioners/aws-itrust-database.js)
* [`provisioners/itrust-cluster.sh`](provisioners/itrust-cluster.sh)
* [`playbooks/itrust-database.yml`](playbooks/itrust-database.yml)
* [`playbooks/itrust-cluster.yml`](playbooks/itrust-cluster.yml)
* [`playbooks/update-itrust-cluster.yml`](playbooks/update-itrust-cluster.yml)
* [`templates/db.properties`](templates/db.properties)
* [`templates/email.properties`](templates/email.properties)
* [`templates/hibernate.properties`](templates/hibernate.properties)
* [`tools/monitor.js`](tools/monitor.js)

---

The rolling update task consists of three parts:

1. Provisioning and configuring the `iTrust` database server.
2. Provisioning and configuring five `iTrust` application servers.
3. Running the `update-itrust-cluser.yml` playbook while the `monitor.js` tool is running.

The provisioning and configuration of the `iTrust` database and application servers is similar to the provisioning and configuration of `iTrust` in the previous milestones, with the following notable exceptions:

* When the `iTrust` database server is provisioned, its IP address is saved to the `vars/main.yml` file to be used later when configuring the five `iTrust` application servers.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/3510a9ca4ac6072060ad6d8d7d97fcf6c5680196/provisioners/aws-itrust-database.js#L192-L204)

* When the `iTrust` database server is configured, a `my.cnf` file is copied to the database server that updates the `bind-address` and `skip-grant-tables` options.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/3510a9ca4ac6072060ad6d8d7d97fcf6c5680196/templates/my.cnf#L1-L3)
	
* When the `iTrust` database server is configured, a new database user is created that can access the database from IP addresses other than `localhost`.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/3510a9ca4ac6072060ad6d8d7d97fcf6c5680196/playbooks/itrust-database.yml#L99-L107)
	
* When the five `iTrust` application servers are provisioned with the `itrust-cluster.sh` script, their IP addresses are all saved to the `itrust-cluster-inventory` file.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/3510a9ca4ac6072060ad6d8d7d97fcf6c5680196/provisioners/aws-itrust-alpha.js#L184-L218)
	
* When the five `iTrust` application servers are configured, the utilize the Ansible templates for `db.properties` and `hibernate.properties` to point to the common `iTrust` database server. This is possible due to the IP address of the `iTrust` database server being saved to the `vars/main.yml` file when it was provisioned.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/3510a9ca4ac6072060ad6d8d7d97fcf6c5680196/playbooks/itrust-cluster.yml#L40-L53)
	
When run, the `monitor.js` tool first pulls the IP addresses of the five `iTrust` application servers from the `itrust-cluster-inventory` file. It then begins polling the appropriate endpoints every ten seconds, outputting the results.

The `update-itrust-cluster.yml` playbook utilizes Ansible's `serial` feature to affect only one of the five `iTrust` application servers at a time. It first stops the running application, then removes the old `v1` source code and copies the new `v2` source code before bringing the application back online. The rolling update process is demonstrated in the **Screencast**.

## Screencast

<!---

Format for YouTube Link in Markdown:

```
[![Milestone Two Screencast](https://img.youtube.com/vi/D37PnUXbMNw/0.jpg)](https://youtu.be/D37PnUXbMNw)
```

--->