const _ = require("lodash");

module.exports = class BaseDecorator {
    constructor({ changelog, labelConfigs, tz }) {
        this.changelog = changelog;
        this.labelConfigs = labelConfigs;
        this.tz = tz;
        this.labelBucket = { issues: [], mergeRequests: [] };
        for (const labelConfigItem of this.labelConfigs) {
            this.labelBucket[labelConfigItem.name] = [];
        }
    }

    populateContentBucketByContents(contents) {
        for (let content of contents) {
            let added = false;
            for (const label of content.labels || []) {
                if (_.has(this.labelBucket, label)) {
                    this.labelBucket[label].push(content.message);
                    added = true;
                }
            }
            if (!added) this.labelBucket[content.defaultLabel].push(content.message);
        }
    }
};
