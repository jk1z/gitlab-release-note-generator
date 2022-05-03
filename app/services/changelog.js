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
        const mergeRequests = await this.gitlabRepository.findMergeRequestsByProjectIdStateStartDateAndEndDate(
            this.config.GITLAB_PROJECT_ID,
            "merged",
            startDate,
            endDate
        );
        this.logger.info(`Found ${mergeRequests ? mergeRequests.length : 0} merge requests`);
        const issues = await this.gitlabRepository.findIssuesByProjectIdStateStartDateAndEndDate(
            this.config.GITLAB_PROJECT_ID,
            "closed",
            startDate,
            endDate
        );
        this.logger.info(`Found ${issues ? issues.length : 0} issues`);
        return {
            mergeRequests,
            issues,
            releaseDate: endDate
        };
    }
};
