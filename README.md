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

-

The provisioning and configuration code for the Jenkins server has remained largely the same as that of the last milestone, with a few notable exceptions in the `jenkins.yml` playbook:

* The environment variables `MYSQL_DB_USER` and `MYSQL_DB_PASSWORD` are passed to the Jenkins server for use in the Rolling Update task.

* Copies of the `checkbox.io`, `iTrust2-v1`, `iTrust2-v2`, and `JenkinsDeploy` projects are cloned to the home directory of the Jenkins server. Packages for the `JenkinsDeploy` project are installed.

* A `deploy` directory structure is created following the structure of the workshop. It contains four sub-directories, `checkbox.git`, `checkbox-www`, `itrust.git`, and `itrust.www`, and bare git repositories are initializes in the `checkbox.git` and `itrust.git` sub-directories.

* Post-receive files that provision and configure the `checkbox.io` and `iTrust2-v1` projects are copied to the `hooks` directories of the respective git repositories.

* Git remotes are added to the `checkbox.io` and `iTrust2-v1` repositories in the home directory that point to the `checkbox.git` and `itrust.git` endpoints.

When the commands `git push checkbox master` and `git push itrust master` are run, the respective `post-receive` hooks provision and configure the `checkbox.io` and `iTrust2-v1` projects, as demonstrated in the screencast.

## Infrastructure Upgrade

## Canary Release

## Rolling Update



## Screencast

<!---

Format for YouTube Link in Markdown:

[![Milestone Two Screencast](https://img.youtube.com/vi/D37PnUXbMNw/0.jpg)](https://youtu.be/D37PnUXbMNw)

--->