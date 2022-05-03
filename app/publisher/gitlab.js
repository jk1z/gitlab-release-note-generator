module.exports = class GitLabPublisher {
    constructor({ gitlabAdapter, loggerService }) {
        this.gitlabAdapter = gitlabAdapter;
        this.logger = loggerService;
    }
    async publish({ projectId, tag, content }) {
        if (tag?.release?.description) {
            this.logger.debug(`Updating the release note`);
            await this.gitlabAdapter.updateTagReleaseByProjectIdTagNameAndTagId(projectId, tag.name, {
                description: content
            });
        } else {
            this.logger.debug(`Creating a new release note`);
            await this.gitlabAdapter.createTagReleaseByProjectIdTagNameAndTagId(projectId, tag.name, {
                description: content
            });
        }
    }
};
