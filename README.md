# Gitlab Release Note Generator
A Gitlab release note generator that generates release note on latest tag

## Feature
-  Generate release note on the latest Tag based on merge requests and issues
-  Issues or merge requests that have these following labels (enhancement, breaking change, feature and bug) now has its distinguished title in the release notes (Note. if an issue or merge request that has 2 or more labels, that issue or merge request will be displayed again under the corresponding title) 

## Software requirement
- NodeJS ^10.x.x

## Installation
- `npm install`

## How to run this app
- Fill in the parameter in the env.js, or feed it in process.env through npm
- `npm install`
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
### Testing
- Unit test on the app with nock

## Credits
Thanks to [github-changelog-generator](https://github.com/github-changelog-generator/github-changelog-generator) for inspiring me to make this app. Sorry, I couldn't wait any longer for that gitlab feature to be merged in.
