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
  const changeLog = await ChangelogLib.getChangelogByStartAndEndDate(startDate, endDate);
  const changeLogContent = await ChangelogLib.generateChangeLogContent(changeLog, {useSlack: false});
  Logger.debug(`Changelog: ${changeLogContent}`);
  return await TagLib.upsertTagDescriptionByProjectIdAndTag(Env.GITLAB_PROJECT_ID, latestTag, changeLogContent);
};