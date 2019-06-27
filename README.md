# Gitlab Release Note Generator
A Gitlab release note generator that generates release note on latest tag

## Feature
-  Generate release note on the latest tag based on merge requests and issues
-  Issues or merge requests that have these following labels (**enhancement**, **breaking change**, **feature** and **bug**) now has its distinguished title in the release notes *(Note. if an issue or merge request that has 2 or more labels, that issue or merge request will be displayed again under the corresponding title)*

## How it works
1. Find the latest tag
2. Find the second latest tag that is on the same branch as the latest tag.
3. Locate the date range between latest and second latest tag. If there is only a tag in the project, then second latest tag would be the project creation date.
4. Find all **Merged** merge requests and **Closed** issues within that time range
5. Generate a release note/changelog based on the findings above.

## Software requirement
- NodeJS ^10.x.x

## Installation
- `npm install`

## How to run this app
- Fill in the parameter in the env.js, or feed it in process.env through npm
- `npm start`
- After couple second, latest tag should have a release note
![](https://dl3.pushbulletusercontent.com/HIav5xaHjcerMtkHT3myQLnl5C9g1UP3/Screen%20Shot%202019-06-01%20at%204.27.18%20pm.png)

## TODO:
### Feature
- Release notes generation on selected tag
- Customise template for the release note
### Integration with Gitlab
- Integrate with gitlab's webhook
- Integrate into part of CD process

## Credits
Thanks to [github-changelog-generator](https://github.com/github-changelog-generator/github-changelog-generator) for inspiring me to make this app. Sorry, I couldn't wait any longer for that gitlab feature to be merged in.
