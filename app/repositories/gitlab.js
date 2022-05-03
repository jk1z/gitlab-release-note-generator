const _ = require("lodash");
module.exports = class GitlabRepository {
    constructor({ gitlabAdapter }) {
        this.gitlabAdapter = gitlabAdapter;
    }
    // MR
    async findMergeRequestsByProjectIdStateStartDateAndEndDate(projectId, state, startDate, endDate) {
        let { mergeRequests, _link } = await this.gitlabAdapter.searchMergeRequestsByProjectId(projectId, {
            state,
            updated_before: endDate,
            updated_after: startDate
        });
        while (_.get(_link, "next")) {
            const res = await _link.next();
            mergeRequests.push(...res.mergeRequests);
            _link = res._link;
        }
        return mergeRequests;
    }

    // Issues
    async findIssuesByProjectIdStateStartDateAndEndDate(projectId, state, startDate, endDate) {
        let { issues, _link } = await this.gitlabAdapter.searchIssuesByProjectId(projectId, {
            state,
            updated_before: endDate,
            updated_after: startDate
        });
        while (_.get(_link, "next")) {
            const res = await _link.next();
            issues = [...issues, res.issues];
            _link = res._link;
        }
        return issues;
    }

    // Commit
    async findBranchRefsByProjectIdAndSha(projectId, sha) {
        return this.gitlabAdapter.findCommitRefsByProjectIdAndSha(projectId, sha, { type: "branch" });
    }

    // Tags
    async findTagsByProjectId(projectId) {
        return this.gitlabAdapter.searchTagsByProjectId(projectId);
    }

    // Repo
    async findRepoByProjectId(projectId) {
        return this.gitlabAdapter.getRepoByProjectId(projectId);
    }
};
