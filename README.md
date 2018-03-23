# Pipeline Project

| **Team Members** | **Contributions to Milestone** |
| :--- | :--- |
| Kanchan Bisht (kbisht) | Checkbox.io Test Generation&nbsp;&nbsp;/&nbsp;&nbsp;Checkbox.io Playbooks&nbsp;&nbsp;/&nbsp;&nbsp;Report |
| Priyanka Jain (pjain15) | Checkbox.io Test Generation&nbsp;&nbsp;/&nbsp;&nbsp;Checkbox.io Playbooks&nbsp;&nbsp;/&nbsp;&nbsp;Report |
| Sourabh Saha (sssaha2) | Jenkins Customization&nbsp;&nbsp;/&nbsp;&nbsp;iTrust Commit Automation&nbsp;&nbsp;/&nbsp;&nbsp;iTrust Test Prioritization Analysis&nbsp;&nbsp;/&nbsp;&nbsp;Report |
| Timothy Dement (tmdement) | Checkbox.io Test Generation&nbsp;&nbsp;/&nbsp;&nbsp;iTrust Commit Fuzzer&nbsp;&nbsp;/&nbsp;&nbsp;Screencast&nbsp;&nbsp;/&nbsp;&nbsp;Report |

[&#8592; MASTER BRANCH](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT)

# Testing and Analysis Milestone

## 1. Coverage / Jenkins Support

The constraints of this milestone required us to customize our Jenkins server in ways that differed from the first milestone, which can be reviewed in the [`jenkins.yml`](playbooks/jenkins.yml) playbook and the first section of the screencast.

Besides separating tasks specific to iTrust and Checkbox.io, we also needed to install an updated version of Node.js and npm, change the Jenkins port from 8080, and add several new plugins to Jenkins, among other minor changes.

Coverage was displayed in Jenkins for iTrust using the `jacoco` plugin (already used by the project), and for Checkbox.io using the `htmlpublisher` plugin (the source of which we generate using the `istanbul-middleware` tool).

## 2. Automated Commit Generation / Commit Fuzzer (iTrust)

This milestone required us to perform testing and analysis using our Jenkins build server from the previous milestone.

In order for Jenkins to run testing on the iTrust repository, we added the `git` plugin to the iTrust job configuration as seen below:

```
scm:
  - git:
      url: file:///home/{{ ansible_user }}/iTrust2-v1
      branches:
        - fuzzer
      wipe-workspace: true
```

We used a local copy of the iTrust repository as the versions on GitHub were being modified, which was causing test failures and failing builds in our Jenkins server.

In order for the Jenkins build to start automatically on commits, we had to ensure that the iTrust repository had a post-commit hook as displayed below.

```
#!/bin/sh
curl http://localhost:8081/git/notifyCommit?url=file:///home/{{ ansible_user }}/iTrust2-v1
```

We also had to enable the polling of `scm` as part of the job configuration, in order for the commit hook to register at the Jenkins url.

```
triggers:
  - pollscm:
      cron: ""
```

After performing all the above steps, on every commit, the build would clone the repository, switch to the `fuzzer` branch, and then start a build using `mvn clean test verify checkstyle:checkstyle`.

After the build has executed successfully, we get the coverage information as part of the JaCoCo library. So we added the JaCoCo plugin to Jenkins and also added it to the job configuration for the iTrust repository.

```
- jacoco:
    exec-pattern: '**/**.exec'
    class-pattern: '**/classes'
    source-pattern: '**/src/main/java'
    update-build-status: false
```

One of the challenges that we faced was the difference between `git reset` and `git revert`.
`git reset` removes all the modifications done as per the latest commit and leaves no trace that the commit existed in the first place.
However, `git revert` makes a new commit, and adds it to the git log.
```
commit 82d77e6decff20376fe3e17feeb9cdbc7726277d
Author: Sourabh Saha <sssaha2@ncsu.edu>
Date:   Sun Mar 18 17:56:04 2018 +0000

    Revert "test commit B1"

    This reverts commit fa04fbc3094d6f145f0e28643f7fcc677c2cc5e8.

commit fa04fbc3094d6f145f0e28643f7fcc677c2cc5e8
Author: Sourabh Saha <sssaha2@ncsu.edu>
Date:   Sun Mar 18 17:55:54 2018 +0000

    test commit B1
```
The problem was that this executed the post-commit hook as well, and we were getting alternate fuzzed and not-fuzzed builds. To solve this issue, we added a commit filter, in the post-commit hook, which checks the git log to see the commit message of the latest commit, and if the commit message has  `revert` in it, it ignores the commit.
```
#!/bin/sh
if  git log -1 | grep -q 'revert' > /dev/null; then
        echo "Found revert"
else
        curl http://localhost:8081/git/notifyCommit?url=file:///home/{{ ansible_user }}/iTrust2-v1
fi
```

For the fuzzing operation, we used the following methods:
* Swapping `<` with `>`

* Swapping `!=` with `==`

* Swapping `0` with `1`

* Change content of `"strings"` in code

Our approach to fuzz the files is as follows:

* First we make a list of all the directories (containing the files that we want to fuzz)

* We then select 10 random files from the total files.

* Then for each of the files, we perform one randomly chosen fuzzing operations, from the ones described above.

* After the 10 files have been fuzzed, we try to compile the project using `mvn compile`.

* If the compilation is successfull, we go ahead and add the files to the git working tree and commit them so that the build starts automatically. Otherwise, we reset the changes and fuzz a different set of 10 files.

## 3. Automated Test Generation (Checkbox.io)

For autogenerating tests, we chose to use a test database. In our pipelining, we added the required MongoDB data to the site database to make the write heads for the API calls. We used the request module to mock the API calls. We used the esprima module to parse server.js file. The call expressions with property name 'get' and 'post' are recognized using esprima and are stored in separate arrays. After this, we have created mock json arguments to passed with get calls and the mock data that we need to pass with post calls. 

One of the challenges that we faced was the coverage for the branches that would be executed on a run-time error/exception. Mocking the data that can lead to exceptions was difficult. For example, some errors could only arise if there would be some problem in the databases/collections/connections of MongoDB. So, if we mock such a case, then the next test cases would fail as the server would crash. Also, when our server was crashing, we were unable to see the coverage statistics.

31 tests were autogenerated in the test.js file to test the code reachable from server.js file.
The test file created can be seen [here](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/test%2Banalysis/test_generation/test.js). 

With these tests in place we received the following coverage:

![Coverage Report for Checkbox](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/test%2Banalysis/coverage%20report.png)


Deatiled coverage reports can be seen here:
* Coverage of server.js file can be seen [here](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/test%2Banalysis/test_generation/coverage/server_coverage.png)

* Coverage of study.js file can be seen [here](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/test%2Banalysis/test_generation/coverage/study_coverage.png)

* Coverage of the admin.js file can be seen [here](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/test%2Banalysis/test_generation/coverage/admin_coverage.png)

* Coverage of the create.js file can be seen [here](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/test%2Banalysis/test_generation/coverage/create_coverage.png)

* Coverage of the studyModel.js can be seen [here](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/test%2Banalysis/test_generation/coverage/study_model_coverage.png)

* Coverage of the upload.js  can be seen [here](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/blob/test%2Banalysis/test_generation/coverage/upload_coverage.png)

To see all the details of coverage obtained by automated test case generation, go to this [folder](https://github.ncsu.edu/tmdement/DEVOPS-PROJECT/tree/test%2Banalysis/test_generation/coverage)

# Link to screencast:

[Screencast]()



