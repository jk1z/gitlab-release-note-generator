const _ = require("lodash");
module.exports = class TagService {
    constructor({ gitlabRepository, loggerService, config }) {
        this.gitlabRepository = gitlabRepository;
        this.logger = loggerService;
        this.config = config;
        this.projectId = this.config.GITLAB_PROJECT_ID;
    }
    async getLatestAndSecondLatestTag() {
        let { tags, _link } = await this.gitlabRepository.findTagsByProjectId(this.projectId);
        if (_.isEmpty(tags)) return [];

        // Only get the latest and second latest one from the same branch
        const latestTag = tags.shift();
        this.logger.info(`Latest tag is ${latestTag.name}`);

        if (!this.isTagsMatchTargetTagRegex([latestTag], this.config.TARGET_TAG_REGEX))
            throw new Error(
                `Latest tag doesn't match with the regex. Target tag regex ${this.config.TARGET_TAG_REGEX}`
            );
        const latestBranches = await this.gitlabRepository.findBranchRefsByProjectIdAndSha(
            this.projectId,
            latestTag.commit?.id
        );
        if (!this.isBranchesInTargetBranch(latestBranches, this.config.TARGET_BRANCH))
            throw new Error(`Latest tag doesn't contain target branch. Target branch ${this.config.TARGET_BRANCH}`);

        if (tags.length === 0) {
            const project = await this.gitlabRepository.findRepoByProjectId(this.projectId);
            this.logger.info("No more tag is found. Assuming project creation date is the start date");
            return [latestTag, { commit: { committed_date: project.created_at } }];
        } else {
            let secondLatestTag = null;
            let page = 0;
            while (!secondLatestTag) {
                for (const tag of tags) {
                    if (this.isTagsMatchTargetTagRegex([tag], this.config.TARGET_TAG_REGEX)) {
                        const branches = await this.gitlabRepository.findBranchRefsByProjectIdAndSha(
                            this.projectId,
                            latestTag.commit?.id
                        );
                        if (this.isBranchesInTargetBranch(branches, this.config.TARGET_BRANCH)) {
                            this.logger.info(
                                `Found the second latest tag on page ${page + 1}. The second latest tag is ${tag.name}`
                            );
                            secondLatestTag = tag;
                            break;
                        }
                    }
                    if (secondLatestTag) break;
                }

                if (!secondLatestTag) {
                    if (!_.isFunction(_link?.next)) break;
                    const res = await _link.next();
                    tags = res.tags;
                    _link = res._link;
                    page++;
                }
            }
            return [latestTag, secondLatestTag];
        }
    }

    isTagsMatchTargetTagRegex(tags, targetTagRegex) {
        if (!targetTagRegex) return true;
        return _.some(tags, (tag) => String(tag?.name).match(targetTagRegex));
    }
    isBranchesInTargetBranch(branches, targetBranchName) {
        if (!targetBranchName) return true;
        return _.some(branches, (branch) => branch.name === targetBranchName);
    }
};
