# Pipeline Project

| **Team Member** | **Milestone Contribution** |
| :---: | :---: |
| Kanchan Bisht ( *kbisht* ) | Canary Release |
| Priyanka Jain ( *pjain15* ) | Canary Release |
| Sourabh Saha ( *sssaha2* ) | Infrastructure Upgrade |
| Timothy Dement ( *tmdement* ) | Basic Deployment</br>Rolling Update |

[&#8592; MASTER BRANCH](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT)

# Deployment Milestone

## 1. Basic Deployment

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

When the commands `git push checkbox master` and `git push itrust master` are run, the respective `post-receive` hooks provision and configure the `checkbox.io` and `iTrust2-v1` projects, as demonstrated in the [**Screencast**](#screencast).

## 2. Infrastructure Upgrade

***Relevant Files:***

* [`provisioners/do-kubernetes.js`](provisioners/do-kubernetes.js)
* [`playbooks/full_kubernetes_deploy.yml`](playbooks/full_kubernetes_deploy.yml)
* [`playbooks/redis_install.yml`](playbooks/redis_install.yml)
* [`templates/10-kubeadm.conf`](templates/10-kubeadm.conf)
* [`templates/deployment-config.yml`](templates/deployment-config.yml)
* [`templates/Dockerfile`](templates/Dockerfile)
* [`templates/start.sh`](templates/start.sh)
* [`templates/server.js`](templates/server.js)
* [`templates/package.json`](templates/package.json)

---

### Dockerized checkbox.io

For making a docker container out of the checkbox.io code, I performed the following steps:

* First, I added the Redis changes to the [`package.json`](templates/package.json) and the [`server.js`](templates/server.js) files.

* Then, the same directory as the checkbox.io folder, I placed a script file to start the `server.js` and restart `nginx`.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/templates/start.sh#L1)

* I create a [`Dockerfile`](templates/Dockerfile) and place in the same directory as [`start.sh`](templates/start.sh).

* The Dockerfile performs the following steps:
	1. Installs `nodejs` and `npm`
	2. Installs `nginx`
	3. Copies the checkbox.io code to `usr/src/app`
	4. Copies the nginx configuration to the appropriate locations
	5. Runs `npm install`
	6. Copies `start.sh`
	7. Exposes port `80` and `443` to the external environment
	8. Adds runtime command to execute `start.sh`

* The image is built using the command `docker build -t sssaha2/checkbox:v7 .`

* I then push the image to `hub.docker.com` and the image can be found [here](https://hub.docker.com/r/sssaha2/checkbox/tags/)

* This image tag `v7` is used in the [`deployment-config.yml`](templates/deployment-config.yml) file, when it deploys the app to the kubernetes cluster.

### Kubernetes Cluster setup

For the kubernetes setup, the steps are:

* We need three nodes, one `master` and two `slaves`. The `master` is responsible to deploy the app on to the `slaves` and the slaves are responsible to maintain the state of the app in case one of them goes down.

* MongoDB is first setup on all three nodes

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/full_kubernetes_deploy.yml#L24-L37)

* Once the Mongo environment has been setup and the user created, I start installing the kubernetes environment on all three nodes

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/full_kubernetes_deploy.yml#L181-L201)

* Once the kubernetes environment is installed, I focus on creating a cluster on the `master` using a [`token`](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/vars/cluster.yml#L2) and `kubeadm` command. Also the `10-kubeadm.conf` file needs to be updated with [`KUBELET_EXTRA_ARGS`](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/templates/10-kubeadm.conf#L9)

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/full_kubernetes_deploy.yml#L217-L235)

* For the networking to work between the nodes, we also need to install an `overlay network` on the master node.
I have used [`weave net`](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/).

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/full_kubernetes_deploy.yml#L245)


* Once the master is setup, I use the `kubeadm join` command in the slave nodes, to connect them to the cluster

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/full_kubernetes_deploy.yml#L264)

* Once the slaves have joined, I deploy the app to the cluster using the [`deployment configuration`](templates/deployment-config.yml).

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/full_kubernetes_deploy.yml#L301)


### Redis flagserver setup

The Redis flagserver's main intention is to have key-value pairs mirrored among all the nodes in the cluster. I used the `master-slave` model here as well. Any keys created in the `master` are replicated in the `slaves` as well. The steps to set this up are:

* First, I install the Redis server onto all of the nodes

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/redis_install.yml#L13)

* Once the environment has been setup, I focus on setting up the `master`. I open the master server to external communication by removing the binding to `127.0.0.1`

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/redis_install.yml#L22)

* Then, I disable the protected-mode so that the `slave` nodes can connected without any need for authentication, and allow port `6379` through the firewall. Service restart is required here

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/redis_install.yml#L29-L39)

* For the slaves, I had to add the line `slaveof <master-ip-address> 6379` to `etc/redis/redis.conf` and restart the service.

	[&#8594; *GO TO IN FILE*](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/d7202d44fb1c9df237edaca8b2adccc3541e59df/playbooks/redis_install.yml#L48-L55)

## 3. Canary Release

***Relevant Files***:

* ['canary-release/aws.yml'](canary-release/aws.yml)
* ['canary-release/setup_servers.yml'](canary-release/setup_servers.yml)
* ['canary-release/roles/checkbox/tasks/main.yml'](canary-release/roles/checkbox/tasks/main.yml)
* ['canary-release/roles/mongodb/tasks/main.yml'](canary-release/roles/mongodb/tasks/main.yml)
* ['canary-release/roles/proxy/tasks/main.yml'](canary-release/roles/proxy/tasks/main.yml)
* ['canary-release/roles/proxy/templates/infrastructure.js.j2'](canary-release/roles/proxy/templates/infrastructure.js.j2)
* ['canary-release/roles/proxy/templates/package.json'](canary-release/roles/proxy/templates/package.json)
* ['canary-release/roles/proxy/templates/redis.cnf.j2'](canary-release/roles/proxy/templates/redis.cnf.j2)

## 4. Rolling Update

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

The `update-itrust-cluster.yml` playbook utilizes Ansible's `serial` feature to affect only one of the five `iTrust` application servers at a time. It first stops the running application, then removes the old `v1` source code and copies the new `v2` source code before bringing the application back online. The rolling update process is demonstrated in the [**Screencast**](#screencast).

## Screencast

**NOTE TO TEAMMATES:**

This is the format for the YouTube links I have been using:

```
[![Milestone Two Screencast](https://img.youtube.com/vi/D37PnUXbMNw/0.jpg)]
(https://youtu.be/D37PnUXbMNw)
```

Just replace `Milestone Two Screencast` with whatever title you'd like, and replace the two instances of `D37PnUXbMNw` with the ID of your YouTube video.

---

For this milestone, we divided the screencasts between team members according to the tasks they worked on.

The following screencast demonstrates the **Basic Deployment** and **Rolling Update** tasks:

[![Basic Deployment and Rolling Upgrade](https://img.youtube.com/vi/QVGiU19SLeU/0.jpg)]
(https://youtu.be/QVGiU19SLeU)

The following screencast demonstrates the **Infrastructure Upgrade** task:

[![Infrastructure upgrade](https://img.youtube.com/vi/6z6wJqsfLiQ/0.jpg)](https://youtu.be/6z6wJqsfLiQ)

The following screencast demonstrates the **Canary Release** task:


[![Canary release](https://img.youtube.com/vi/7oxKxBvVgy4/0.jpg)](https://youtu.be/7oxKxBvVgy4)
