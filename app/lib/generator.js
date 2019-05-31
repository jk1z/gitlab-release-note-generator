const IssueLib = require("./issue");
const MergeRequestLib = require("./mergeRequest");
const TagLib = require("./tag");
const Env = require("../env");

exports.generate = async () => {
    const latestTag = await TagLib.getLatestTagByProjectId(Env.GITLAB_PROJECT_ID);
    if (latestTag) {
        const [startDate, endDate] = await TagLib.getDateRangeFromLatestAndSecondLatestTagByProjectId(Env.GITLAB_PROJECT_ID);
        const mergeRequests = await MergeRequestLib.getMergeRequestByProjectIdStateStartDateAndEndDate(Env.GITLAB_PROJECT_ID, "merged", startDate, endDate);
        const issues = await IssueLib.searchIssuesByProjectIdStateStartDateAndEndDate(Env.GITLAB_PROJECT_ID, "closed", startDate, endDate);
        const changeLog = createChangeLog({issues, mergeRequests});
        return await TagLib.createTagDescriptionByProjectIdAndTagName(Env.GITLAB_PROJECT_ID, latestTag.name, changeLog);
    } else {
        console.warn("No tags found in the project");
    }
};

const createChangeLog = ({issues, mergeRequests}) => {
    return `#### Closed issues\n${issues.map(issue => {
    return `- ${IssueLib.formatIssue(issue)}\n`
    })}#### Merged merge requests\n${mergeRequests.map(mergeRequest => {
        return `- ${MergeRequestLib.formatMergeRequest(mergeRequest)}\n`
    })}`;
};