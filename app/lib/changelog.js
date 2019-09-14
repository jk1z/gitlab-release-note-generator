const _ = require("lodash");
const IssueLib = require("./issue");
const MergeRequestLib = require("./mergeRequest");
const Moment = require("moment-timezone");
const Env = require("../env");

const LABEL_CONFIG = [
  { name: "breaking change", title: "Notable changes" },
  { name: "enhancement", title: "Enhancements" },
  { name: "feature", title: "New features" },
  { name: "bug", title: "Fixed bugs" }
];

exports.createGitLabChangeLog = ({ releaseDate, issues, mergeRequests }) => {
  // Separate by labels
  const changelog = { issues: [], mergeRequests: [] };

  for (const issue of issues) {
    let added = false;
    for (const label of issue.labels) {
      const labelConfig = _.find(LABEL_CONFIG, o => o.name === label);
      if (labelConfig) {
        if (!changelog[labelConfig.name]) changelog[labelConfig.name] = [];
        changelog[labelConfig.name].push(`- ${IssueLib.gitLabFormatter(issue)}\n`);
        added = true;
      }
    }
    if (!added) {
      changelog.issues.push(`- ${IssueLib.gitLabFormatter(issue)}\n`);
    }
  }

  for (const mergeRequest of mergeRequests) {
    let added = false;
    for (const label of mergeRequest.labels) {
      const labelConfig = _.find(LABEL_CONFIG, o => o.name === label);
      if (labelConfig) {
        if (!changelog[labelConfig.name]) changelog[labelConfig.name] = [];
        changelog[labelConfig.name].push(`- ${MergeRequestLib.gitLabFormatter(mergeRequest)}\n`);
        added = true;
      }
    }
    if (!added) {
      changelog.mergeRequests.push(`- ${MergeRequestLib.gitLabFormatter(mergeRequest)}\n`);
    }
  }

  const labelConfigs = [...LABEL_CONFIG,
    { name: "issues", title: "Closed issues" }, {
      name: "mergeRequests",
      title: "Merged merge requests"
    }];
  let changelogMarkDown = `### Release note (${Moment.tz(releaseDate, Env.TZ).format("YYYY-MM-DD")})\n`;
  for (const labelConfig of labelConfigs) {
    if (changelog[labelConfig.name]) {
      changelogMarkDown += `#### ${labelConfig.title}\n`;
      for (const entry of changelog[labelConfig.name]) {
        changelogMarkDown += entry;
      }
    }
  }
  return changelogMarkDown.length === 0 ? `` : changelogMarkDown;
};

exports.createSlackChangeLog = ({ releaseDate, issues, mergeRequests }) => {
  // Separate by labels
  const changelog = { issues: [], mergeRequests: [] };

  for (const issue of issues) {
    let added = false;
    for (const label of issue.labels) {
      const labelConfig = _.find(LABEL_CONFIG, o => o.name === label);
      if (labelConfig) {
        if (!changelog[labelConfig.name]) changelog[labelConfig.name] = [];
        changelog[labelConfig.name].push(`- ${IssueLib.slackFormatter(issue)}\n`);
        added = true;
      }
    }
    if (!added) {
      changelog.issues.push(`- ${IssueLib.slackFormatter(issue)}\n`);
    }
  }

  for (const mergeRequest of mergeRequests) {
    let added = false;
    for (const label of mergeRequest.labels) {
      const labelConfig = _.find(LABEL_CONFIG, o => o.name === label);
      if (labelConfig) {
        if (!changelog[labelConfig.name]) changelog[labelConfig.name] = [];
        changelog[labelConfig.name].push(`- ${MergeRequestLib.slackFormatter(mergeRequest)}\n`);
        added = true;
      }
    }
    if (!added) {
      changelog.mergeRequests.push(`- ${MergeRequestLib.slackFormatter(mergeRequest)}\n`);
    }
  }

  const labelConfigs = [...LABEL_CONFIG,
    { name: "issues", title: "Closed issues" }, {
      name: "mergeRequests",
      title: "Merged merge requests"
    }];
  let changelogMarkDown = `*Release note (${Moment.tz(releaseDate, Env.TZ).format("YYYY-MM-DD")})*\n`;
  for (const labelConfig of labelConfigs) {
    if (changelog[labelConfig.name]) {
      changelogMarkDown += `*${labelConfig.title}*\n`;
      for (const entry of changelog[labelConfig.name]) {
        changelogMarkDown += entry;
      }
    }
  }
  return changelogMarkDown.length === 0 ? `` : changelogMarkDown;
};