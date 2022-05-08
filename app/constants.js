exports.SERVICE_PROVIDER_GITLAB = "gitlab";
exports.SERVICE_PROVIDER_SLACK = "slack";

exports.LABEL_CONFIG = [
    { name: "breaking change", title: "Notable changes" },
    { name: "enhancement", title: "Enhancements" },
    { name: "feature", title: "New features" },
    { name: "bug", title: "Fixed bugs" }
];

exports.defaultOptions = {
    GITLAB_API_ENDPOINT: "https://gitlab.com/api/v4",
    NODE_ENV: process.env.NODE_ENV,
    TZ: "Australia/Melbourne",
    SERVICE_PROVIDER: exports.SERVICE_PROVIDER_GITLAB
};
