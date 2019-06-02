const _ = require("lodash");
const IssueLib = require("./issue");
const MergeRequestLib = require("./mergeRequest");
const Moment = require("moment-timezone");
const Env = require("../env");

const LABEL_CONFIG = [{name: "breaking change", title: "Notable changes"}, {name: "enhancement", title: "Enhancements"}, {name: "feature", title: "New features"}, {name: "bug", title: "Fixed bugs"}];

exports.createChangeLog = ({releaseDate ,issues, mergeRequests}) => {
    // Separate by labels
    const changelog = {issues: [], mergeRequests: []};

    for (const issue of issues){
        let added = false;
        for (const label of issue.labels){
            const labelConfig = _.find(LABEL_CONFIG, o => o.name === label);
            if (labelConfig) {
                if (!changelog[labelConfig.name]) changelog[labelConfig.name] = [];
                changelog[labelConfig.name].push(`- ${IssueLib.format(issue)}\n`);
                added = true;
            }
        }
        if (!added) {
            changelog.issues.push(`- ${IssueLib.format(issue)}\n`);
        }
    }

    for (const mergeRequest of mergeRequests){
        let added = false;
        for (const label of mergeRequest.labels){
            const labelConfig = _.find(LABEL_CONFIG, o => o.name === label);
            if (labelConfig) {
                if (!changelog[labelConfig.name]) changelog[labelConfig.name] = [];
                changelog[labelConfig.name].push(`- ${MergeRequestLib.format(mergeRequest)}\n`);
                added = true;
            }
        }
        if (!added) {
            changelog.mergeRequests.push(`- ${MergeRequestLib.format(mergeRequest)}\n`);
        }
    }

    const labelConfigs = [...LABEL_CONFIG, {name: "issues", title: "Closed issues"}, {name: "mergeRequests", title: "Merged merge requests"}];
    let changelogMarkDown = `### Release note (${Moment.tz(releaseDate, Env.TZ).format("YYYY-MM-DD")})\n`;
    for (const labelConfig of labelConfigs){
        if (changelog[labelConfig.name]){
            changelogMarkDown += `#### ${labelConfig.title}\n`;
            for(const entry of changelog[labelConfig.name]){
                changelogMarkDown += entry;
            }
        }
    }
    return changelogMarkDown.length === 0 ? ``:changelogMarkDown;
};

// return `#### Closed issues\n${issues.map(issue => {
//     return `- ${IssueLib.formatIssue(issue)}\n`
// })}#### Merged merge requests\n${mergeRequests.map(mergeRequest => {
//     return `- ${MergeRequestLib.formatMergeRequest(mergeRequest)}\n`
// })}`;