[![CircleCI](https://circleci.com/gh/jk1z/gitlab-release-note-generator/tree/master.svg?style=svg)](https://circleci.com/gh/jk1z/gitlab-release-note-generator/tree/master)
[![codecov](https://codecov.io/gh/jk1z/gitlab-release-note-generator/branch/master/graph/badge.svg)](https://codecov.io/gh/jk1z/gitlab-release-note-generator)


# Gitlab Release Note Generator

A Gitlab release note generator that generates release note on latest tag

## Feature
-  Generate release note on the latest tag based on merge requests and issues
-  Distinguished title with issues or merge requests that have the following labels: **enhancement**, **breaking change**, **feature** and **bug**
   
   *(Note. if an issue or merge request that has 2 or more labels, that issue or merge request will be displayed again under the corresponding title)*
   
-  Can be integrated as a CD service. Tutorial below


## How it works
1. Find the latest tag
2. Find the previous tag that is on the same branch as the latest tag.
3. Locate the date range between the latest and the previous tag. If there is only a tag in the project, then the `from` date will be the project creation date and the `to` date will be that tag's creation date.
4. Find all **Merged** merge requests and **Closed** issues within that time range
5. Generate a release note/changelog based on the findings above.

## Software requirement
- NodeJS ^10.x.x OR docker
- A gitlab personal access token with `api` permission. [How to Tutorial](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)

## How to run this app

### Docker method

```shell
docker container run -e GITLAB_PERSONAL_TOKEN=gitlabSampleToken -e GITLAB_PROJECT_ID=12345678 -e TARGET_BRANCH=sampleTargetBranch -e TARGET_TAG_REGEX=sampleRegex 00freezy00/gitlab-release-note-generator
```

### Nodejs Method
- Fill in the parameters mainly `GITLAB_PERSONAL_TOKEN`, `GITLAB_PROJECT_ID`, `TARGET_BRANCH`(optional. Use it only if you want to find tags in the same specific branch) and `TARGET_TAG_REGEX` (optional. Can use it to distinguish master or develop branch version bump) in `app/env.js` or feed it in `process.env` through npm
- `npm install`
- `npm start`
- After couple seconds, latest tag should have a release note
![](https://dl3.pushbulletusercontent.com/HIav5xaHjcerMtkHT3myQLnl5C9g1UP3/Screen%20Shot%202019-06-01%20at%204.27.18%20pm.png)

### Gitlab CI method
1. Need to pass in `gitlab personal access token` as a CI variable
2. c/p the `.sample.gitlab-ci.yml` to your gitlab ci.
   
   What's included in the sample gitlab CI script
   
   - `generate-release-note` job. Generates a release note on the tag after detecting tag push with this regex `/^[0-9]+.[0-9]+.[0-9]+(-[0-9]+)?$/`
   - `tag-after-deployment` job (optional). Tag the commit that contains a version bump with this regex `/^[0-9]+.[0-9]+.[0-9]+(-[0-9]+)?$/`. **Require ssh key to work.**
3. Customise the gitlab ci script to your need

Reference gitlab repo: [generator test](https://gitlab.com/jackzhang/generator-test)


## Options

These can be specified using environment variables

* GITLAB_API_ENDPOINT: Your gitlab instaqnce's endpoint 
  * Default https://gitlab.com/api/v4
* GITLAB_PERSONAL_TOKEN: Grant api read/access permission
* GITLAB_PROJECT_ID: Your project id that is located under settings > general
* TARGET_BRANCH: The branch to look for release tags (ie master)
* TARGET_TAG_REGEX:  Regular expression of the release tags to search (ie: ^release-.*$)
* TZ: The timezone for your release notes 
  * Default "Australia/Melbourne"
* ISSUE_CLOSED_SECONDS: The amount of seconds to search after the last commit,  useful for Merge Requests that close their tickets a second after the commit.
  * Default 0

## Building and Running locally

```bash
export GITLAB_PERSONAL_TOKEN=MYGITLABACCESSTOKEN
export GITLAB_PROJECT_ID=99
export GITLAB_API_ENDPOINT=https://my.gitlab.com/api/v4

// run docker to build my local version
docker build -t local-gitlab-release-note-generator .

// run my local version
docker container run \
  -e TZ=America/New_York \
  -e GITLAB_API_ENDPOINT=$GITLAB_API_ENDPOINT \
  -e GITLAB_PERSONAL_TOKEN=$GITLAB_PERSONAL_TOKEN \
  -e GITLAB_PROJECT_ID=$GITLAB_PROJECT_ID \
  -e TARGET_BRANCH=master \
  -e TARGET_TAG_REGEX=^release-.*$ \
  local-gitlab-release-note-generator

```

## TODO:
### Feature
- Release notes generation on selected tag
- Customise template for the release note

## Credits
Thanks to [github-changelog-generator](https://github.com/github-changelog-generator/github-changelog-generator) for inspiring me to make this app. Sorry, I couldn't wait any longer for that gitlab feature to be merged in.
