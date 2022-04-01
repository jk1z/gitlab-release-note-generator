const Moment = require("moment-timezone");
const _ = require("lodash");

const BaseDecorator = require("./base");

module.exports = class GitlabDecorator extends BaseDecorator {
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
        let output = `### Release note (${Moment.tz(this.changelog.releaseDate, this.tz).format("YYYY-MM-DD")})\n`;
        for (const labelConfig of this.labelConfigs) {
            if (this.labelBucket[labelConfig.name]) {
                if (!_.isEmpty(this.labelBucket[labelConfig.name]) || labelConfig.default) {
                    output += `#### ${labelConfig.title}\n`;
                    if (!_.isEmpty(this.labelBucket[labelConfig.name])) {
                        output += this.labelBucket[labelConfig.name].join("\n") + "\n";
                    }
                }
            }
        }
        return output;
    }
    decorateIssue(issue) {
        return `- ${issue.title} [#${issue.iid}](${issue.web_url})`;
    }
    decorateMergeRequest(mergeRequest) {
        return `- ${mergeRequest.title} [#${mergeRequest.iid}](${mergeRequest.web_url}) ([${_.get(
            mergeRequest,
            "author.username"
        )}](${_.get(mergeRequest, "author.web_url")}))`;
    }
};
