const Moment = require("moment-timezone");
const _ = require("lodash");
const Env = require("../env");
const BaseDecorator = require("./base");

module.exports = class SlackDecorator extends BaseDecorator {
    constructor({ changelog, labelConfigs, tz }) {
        super({ changelog, labelConfigs, tz });
    }
    generateContent() {
        let { issues, mergeRequests } = this.changelog;
        issues = issues.map((issue) => {
            return { message: this.decorateIssue(issue), labels: [...issue.labels], defaultLabel: "issues" };
        });
        mergeRequests = mergeRequests.map((mergeRequest) => {
            return {
                message: this.decorateMergeRequest(mergeRequest),
                labels: [...mergeRequest.labels],
                defaultLabel: "mergeRequest"
            };
        });
        this.populateContentBucketByContents([...issues, ...mergeRequests]);
        let output = `*Release note (${Moment.tz(this.changelog.releaseDate, Env.TZ).format("YYYY-MM-DD")})*\n`;
        for (const labelConfig of this.labelConfigs) {
            if (this.labelBucket[labelConfig.name]) {
                output += `*${labelConfig.title}*\n`;
                output += this.labelBucket[labelConfig.name].join("\n");
            }
        }
        return output;
    }

    decorateIssue(issue) {
        return `- ${issue.title} <${issue.web_url}|#${issue.iid}>`;
    }
    decorateMergeRequest(mergeRequest) {
        return `- ${mergeRequest.title} <${mergeRequest.web_url}|#${mergeRequest.iid}> (<${_.get(
            mergeRequest,
            "author.web_url"
        )}|${_.get(mergeRequest, "author.username")}>)`;
    }
};
