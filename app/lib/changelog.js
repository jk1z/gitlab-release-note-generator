const IssueLib = require("./issue");
const MergeRequestLib = require("./mergeRequest");


exports.createChangeLog = ({issues, mergeRequests}) => {
    return `#### Closed issues\n${issues.map(issue => {
        return `- ${IssueLib.formatIssue(issue)}\n`
    })}#### Merged merge requests\n${mergeRequests.map(mergeRequest => {
        return `- ${MergeRequestLib.formatMergeRequest(mergeRequest)}\n`
    })}`;
};