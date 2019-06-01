const IssueLib = require("./issue");
const MergeRequestLib = require("./mergeRequest");
const TagLib = require("./tag");
const ChangelogLib = require("./changelog");
const Logger = require("../logger");
const Moment = require("moment-timezone");
const Env = require("../env");

exports.generate = async () => {
    const latestTag = await TagLib.getLatestTagByProjectId(Env.GITLAB_PROJECT_ID);

    if (latestTag) {
        Logger.info(`Latest tag is ${latestTag.name}`);
        const [endDate, startDate] = await TagLib.getDateRangeFromLatestAndSecondLatestTagByProjectId(Env.GITLAB_PROJECT_ID);
        Logger.info(`Time range that we are looking at MRs and issues is between ${startDate} and ${endDate}`);
        const mergeRequests = await MergeRequestLib.getMergeRequestByProjectIdStateStartDateAndEndDate(Env.GITLAB_PROJECT_ID, "merged", startDate, endDate);
        Logger.info(`Found ${mergeRequests ? mergeRequests.length : 0} merge requests`);
        const issues = await IssueLib.searchIssuesByProjectIdStateStartDateAndEndDate(Env.GITLAB_PROJECT_ID, "closed", startDate, endDate);
        Logger.info(`Found ${issues ? issues.length : 0} merge requests`);
        const changeLog = ChangelogLib.createChangeLog({issues, mergeRequests});
        Logger.debug(`Changelog: ${changeLog}`);
        return await TagLib.upsertTagDescriptionByProjectIdAndTag(Env.GITLAB_PROJECT_ID, latestTag, changeLog);
    } else {
        Logger.warn(`No tags found in the project ${Env.GITLAB_PROJECT_ID}`);
    }
};