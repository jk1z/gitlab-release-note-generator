const _ = require("lodash");
const IssueLib = require("./issue");
const MergeRequestLib = require("./mergeRequest");
const Moment = require("moment-timezone");
const Env = require("../env");
const Logger = require("../logger");

// Changelog available format
exports.CHANGELOG_FORMAT_SLACK = "slack-format";
exports.CHANGELOG_FORMAT_GITLAB = "gitlab-format";
exports.CHANGELOG_FORMAT = [
  exports.CHANGELOG_FORMAT_SLACK,
  exports.CHANGELOG_FORMAT_GITLAB
];

const LABEL_CONFIG = [
  { name: "breaking change", title: "Notable changes" },
  { name: "enhancement", title: "Enhancements" },
  { name: "feature", title: "New features" },
  { name: "bug", title: "Fixed bugs" }
];

exports.generateChangeLogContent = async ({ releaseDate, issues, mergeRequests }, options = {}) => {
  // Separate by labels
  let changelogBucket = exports._createLabelBucket();

  exports._populateIssuesWithBucketByIssue(changelogBucket, issues, options);

  exports._populateMergeRequestsWithBucketByMergeRequests(changelogBucket, mergeRequests, options);

  const labelConfigs = [
    ...LABEL_CONFIG,
    { name: "issues", title: "Closed issues", default: true },
    { name: "mergeRequests", title: "Merged merge requests", default: true }
  ];
  if (options.useSlack) {
    let changelogContent = `*Release note (${Moment.tz(releaseDate, Env.TZ).format("YYYY-MM-DD")})*\n`;
    for (const labelConfig of labelConfigs) {
      if (changelogBucket[labelConfig.name]) {
        changelogContent += `*${labelConfig.title}*\n`;
        changelogContent += changelogBucket[labelConfig.name].join("\n");
      }
    }
    return changelogContent;
  } else {
    let changelogContent = `### Release note (${Moment.tz(releaseDate, Env.TZ).format("YYYY-MM-DD")})\n`;
    for (const labelConfig of labelConfigs) {
      if (changelogBucket[labelConfig.name]) {
          if (!_.isEmpty(changelogBucket[labelConfig.name]) || (labelConfig.default && Env.RENDER_EMPTY_SECTIONS)) {
            changelogContent += `#### ${labelConfig.title}\n`;
            if (!_.isEmpty(changelogBucket[labelConfig.name])) changelogContent += changelogBucket[labelConfig.name].join("\n") + "\n";
          }
      }
    }
    return changelogContent;
  }
};

exports._createLabelBucket = () => {
  const labelBucket = { issues: [], mergeRequests: [] };
  for (const labelConfigItem of LABEL_CONFIG) {
    labelBucket[labelConfigItem.name] = [];
  }
  return labelBucket;
};

exports._populateIssuesWithBucketByIssue = (bucket, issues, options = {}) => {
  for (const issue of issues) {
    let added = false;
    for (const label of issue.labels || []) {
      if (_.has(bucket, label)) {
        bucket[label].push(IssueLib.decorateIssue(issue, options));
        added = true;
      }
    }
    if (!added) bucket.issues.push(IssueLib.decorateIssue(issue, options));
  }
  return bucket;
};

exports._populateMergeRequestsWithBucketByMergeRequests = (bucket, mergeRequests, options = {}) => {
  for (const mergeRequest of mergeRequests) {
    let added = false;
    for (const label of mergeRequest.labels || []) {
      if (_.has(bucket, label)) {
        bucket[label].push(MergeRequestLib.decorateMergeRequest(mergeRequest, options));
        added = true;
      }
    }
    if (!added) bucket.mergeRequests.push(MergeRequestLib.decorateMergeRequest(mergeRequest, options));
  }
  return bucket;
};

exports.getChangelogByStartAndEndDate = async (startDate, endDate, options = {}) => {
  Logger.info(`Time range that we are looking at MRs and issues is between ${Moment.tz(startDate, Env.TZ)} and ${Moment.tz(endDate, Env.TZ)}`);
  const mergeRequests = await MergeRequestLib.getMergeRequestByProjectIdStateStartDateAndEndDate(Env.GITLAB_PROJECT_ID, "merged", startDate, endDate);
  Logger.info(`Found ${mergeRequests ? mergeRequests.length : 0} merge requests`);
  const issues = await IssueLib.searchIssuesByProjectIdStateStartDateAndEndDate(Env.GITLAB_PROJECT_ID, "closed", startDate, endDate);
  Logger.info(`Found ${issues ? issues.length : 0} issues`);
  return {
    mergeRequests,
    issues,
    releaseDate: endDate
  }
};