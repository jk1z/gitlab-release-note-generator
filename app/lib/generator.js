const _ = require("lodash");
const IssueLib = require("./issue");
const MergeRequestLib = require("./mergeRequest");
const TagLib = require("./tag");
const ChangelogLib = require("./changelog");
const Logger = require("../logger");
const Moment = require("moment-timezone");
const Env = require("../env");

exports.generate = async () => {
  const [latestTag, secondLatestTag] = await TagLib.getLatestAndSecondLatestTagByProjectId(Env.GITLAB_PROJECT_ID);
  if (!_.get(latestTag, "commit.committed_date") || !_.get(secondLatestTag, "commit.committed_date")) {
    Logger.error(`Cannot find latest and second latest tag. Abort the program!`);
    return;
  }
  const startDate = _.get(secondLatestTag, "commit.committed_date");
  const endDate = _.get(latestTag, "commit.committed_date");
  Logger.info(`Time range that we are looking at MRs and issues is between ${Moment.tz(startDate, Env.TZ)} and ${Moment.tz(endDate, Env.TZ)}`);
  const mergeRequests = await MergeRequestLib.getMergeRequestByProjectIdStateStartDateAndEndDate(Env.GITLAB_PROJECT_ID, "merged", startDate, endDate);
  Logger.info(`Found ${mergeRequests ? mergeRequests.length : 0} merge requests`);
  const issues = await IssueLib.searchIssuesByProjectIdStateStartDateAndEndDate(Env.GITLAB_PROJECT_ID, "closed", startDate, endDate);
  Logger.info(`Found ${issues ? issues.length : 0} issues`);
  const changeLog = ChangelogLib.createGitLabChangeLog({ releaseDate: endDate, issues, mergeRequests });
  Logger.debug(`Changelog: ${changeLog}`);
  return await TagLib.upsertTagDescriptionByProjectIdAndTag(Env.GITLAB_PROJECT_ID, latestTag, changeLog);
};