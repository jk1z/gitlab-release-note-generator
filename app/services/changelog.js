const Moment = require("moment-timezone");

module.exports = class ChangelogService {
    constructor({ gitlabRepository, loggerService, config }) {
        this.gitlabRepository = gitlabRepository;
        this.logger = loggerService;
        this.config = config;
    }

    async getChangelogByStartAndEndDate(startDate, endDate) {
        this.logger.info(
            `Time range that we are looking at MRs and issues is between ${Moment.tz(
                startDate,
                this.config.TZ
            )} and ${Moment.tz(endDate, this.config.TZ)}`
        );
        let mergeRequests = await this.gitlabRepository.findMergeRequestsByProjectIdStateStartDateAndEndDate(
            this.config.GITLAB_PROJECT_ID,
            "merged",
            startDate,
            endDate
        );
        mergeRequests = mergeRequests.filter((mergeRequest) =>
            Moment.tz(mergeRequest.merged_at, this.config.TZ).isBetween(startDate, endDate, "second", "[]")
        );
        this.logger.info(`Found ${mergeRequests ? mergeRequests.length : 0} merge requests`);
        let issues = await this.gitlabRepository.findIssuesByProjectIdStateStartDateAndEndDate(
            this.config.GITLAB_PROJECT_ID,
            "closed",
            startDate,
            endDate
        );
        issues = issues.filter((issue) =>
            Moment.tz(issue.closed_at, this.config.TZ).isBetween(startDate, endDate, "second", "[]")
        );
        this.logger.info(`Found ${issues ? issues.length : 0} issues`);
        return {
            mergeRequests,
            issues
        };
    }
};
