# GitLab Changelog Generator
GitLab changelog generator based on merge requests and issues

## Feature
-  Create release note (changelog) on the latest Tag

## Software requirement
- NodeJS 10.15.3

## How to run this app
- Fill in the parameter in the env.js, or feed it in process.env through npm
- npm install
- npm start
- After couple second, latest tag should have a changelog
![](https://dl3.pushbulletusercontent.com/HIav5xaHjcerMtkHT3myQLnl5C9g1UP3/Screen%20Shot%202019-06-01%20at%204.27.18%20pm.png)

## TODO:
### Feature
- Changelog generated from fixed selection of labels (enhancement, breaking change, feature and bug fixes)
- Full changelog generation option
- Customise template for the changelog
### Integration with Gitlab
- Integrate with gitlab's webhook
- Integrate into part of CD process
### Testing
- Unit test on the app with nock

### Documentation 
- WIP

## Installation
- WIP
### Via webhook
- WIP
### Part of the CD process
- WIP

## Credits
Thanks to [github-changelog-generator](https://github.com/github-changelog-generator/github-changelog-generator) for inspiring me to make this app. Sorry, I couldn't wait any longer for that gitlab feature to be merged in.
