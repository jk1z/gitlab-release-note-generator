const Moment = require("moment-timezone");
const Constants = require("./constants");

module.exports = class GitLabReleaseNoteGenerator {
    constructor({ config, tagService, changelogService, loggerService, gitlabAdapter }) {
        this.config = config;
        this.tagService = tagService;
        this.changelogService = changelogService;
        this.logger = loggerService;
        this.gitlabAdapter = gitlabAdapter;
    }
    async run() {
        const tags = await this.tagService.getLatestAndSecondLatestTag();
        if (tags.length !== 2) {
            throw new Error("Cannot find latest and second latest tag. Tag Result: " + JSON.stringify(tags));
        }
        const [latestTag, secondLatestTag] = tags;
        if (!latestTag?.commit?.committed_date || !secondLatestTag?.commit?.committed_date) {
            throw new Error(`Cannot find latest and second latest tag. Abort the program!`);
        }
        const startDate = secondLatestTag.commit.committed_date;
        let endDate = latestTag.commit.committed_date;

        // allow the end date to be adjusted by a few seconds to catch issues that are automatically closed by
        // a MR and are time stamped a few seconds later.
        if (this.config.ISSUE_CLOSED_SECONDS > 0) {
            this.logger.debug(`EndDate: ${endDate}`);
            this.logger.debug(`Adding Seconds: ${this.config.ISSUE_CLOSED_SECONDS}`);
            endDate = Moment.tz(endDate, this.config.TZ).add(this.config.ISSUE_CLOSED_SECONDS, "seconds").toISOString();
            this.logger.debug(`New End Date: ${endDate}`);
        }
        const { mergeRequests, issues } = await this.changelogService.getChangelogByStartAndEndDate(startDate, endDate);

        const labelConfigs = [
            ...Constants.LABEL_CONFIG,
            { name: "issues", title: "Closed issues", default: true },
            { name: "mergeRequests", title: "Merged merge requests", default: true }
        ];
        const DecoratorFactory = require("./decorators");
        const decorator = new DecoratorFactory({
            SERVICE_PROVIDER: this.config.SERVICE_PROVIDER,
            loggerService: this.logger
        }).create({
            changelog: { mergeRequests, issues, releaseDate: endDate },
            labelConfigs,
            tz: this.config.TZ
        });
        const content = decorator.generateContent();
        this.logger.debug(`(${this.config.SERVICE_PROVIDER} format) Changelog: ${content}`);

        const PublisherFactory = require("./publishers");
        const publisher = new PublisherFactory({
            SERVICE_PROVIDER: this.config.SERVICE_PROVIDER,
            gitlabAdapter: this.gitlabAdapter,
            loggerService: this.logger
        }).create();
        await publisher.publish({
            projectId: this.config.GITLAB_PROJECT_ID,
            tag: latestTag,
            content
        });
    }
};
