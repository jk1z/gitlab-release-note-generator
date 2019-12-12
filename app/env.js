exports.GITLAB_API_ENDPOINT = process.env.GITLAB_API_ENDPOINT || "https://gitlab.com/api/v4";
exports.GITLAB_PERSONAL_TOKEN = process.env.GITLAB_PERSONAL_TOKEN || "sampleGitlabPersonalToken"; // Grant api read/access permission
exports.GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID || "12345678"; // Your project id that is located under settings > general
exports.TARGET_BRANCH = process.env.TARGET_BRANCH;
exports.TARGET_TAG_REGEX = process.env.TARGET_TAG_REGEX ? new RegExp(process.env.TARGET_TAG_REGEX): undefined;
exports.TZ = process.env.TZ || "Australia/Melbourne"; // TZ variable is for better logging
exports.NODE_ENV = process.env.NODE_ENV;

// will looks for issues closed this many seconds after the tag,  this may happen if the issue is merged via a MR and automatially closed
// example -e GITLAB_ISSUE_SECOND_DELAY=60 will catch issues closed up to 60 seconds after the tag is created.
exports.ISSUE_CLOSED_SECONDS = process.env.ISSUE_CLOSED_SECONDS || "0" 
