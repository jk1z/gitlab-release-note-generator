exports.GITLAB_API_ENDPOINT = process.env.GITLAB_API_ENDPOINT || "https://gitlab.com/api/v4";
exports.GITLAB_PERSONAL_TOKEN = process.env.GITLAB_PERSONAL_TOKEN || ""; // Grant api read/access permission
exports.GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID || ""; // Your project id that is located under settings > general
exports.TZ = process.env.TZ || "Australia/Melbourne"; // TZ variable is for better logging