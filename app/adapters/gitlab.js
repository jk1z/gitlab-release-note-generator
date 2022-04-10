const Got = require("got");
const QueryString = require("querystring");
const LinkHeaderParse = require("parse-link-header");

module.exports = class GitlabAdapter {
    constructor({ config }) {
        this.GITLAB_PERSONAL_TOKEN = config.GITLAB_PERSONAL_TOKEN;
        this.GITLAB_API_ENDPOINT = config.GITLAB_API_ENDPOINT;
        this.gotDefaultOptions = {
            headers: { "Private-Token": this.GITLAB_PERSONAL_TOKEN }
        };
    }
    _decorateLinks(link, templateFunction, templateArgs, query) {
        const linkObj = {};
        if (link) {
            link = LinkHeaderParse(link);
            for (const key of Object.keys(link)) {
                linkObj[key] = () =>
                    templateFunction.apply(null, [
                        ...templateArgs,
                        { ...query, page: link[key].page, per_page: link[key].per_page }
                    ]);
            }
        }
        return linkObj;
    }

    async getRepoByProjectId(projectId) {
        return Got.get(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}`, {
            ...this.gotDefaultOptions
        }).json();
    }

    async searchMergeRequestsByProjectId(projectId, query) {
        const queryString = query ? QueryString.stringify(query) : null;
        const response = await Got.get(
            `${this.GITLAB_API_ENDPOINT}/projects/${projectId}/merge_requests${queryString ? `?${queryString}` : ""}`,
            { ...this.gotDefaultOptions }
        ).json();
        const linkObj = this._decorateLinks(
            response.headers.link,
            this.searchMergeRequestsByProjectId,
            [projectId],
            query
        );
        return {
            mergeRequests: response.body,
            _link: linkObj
        };
    }

    async searchIssuesByProjectId(projectId, query) {
        const queryString = query ? QueryString.stringify(query) : null;
        const response = await Got.get(
            `${this.GITLAB_API_ENDPOINT}/projects/${projectId}/issues${queryString ? `?${queryString}` : ""}`,
            {
                ...this.gotDefaultOptions
            }
        ).json();
        const linkObj = this._decorateLinks(response.headers.link, this.searchIssuesByProjectId, [projectId], query);
        return {
            issues: response.body,
            _link: linkObj
        };
    }

    async searchTagsByProjectId(projectId, query) {
        const queryString = query ? QueryString.stringify(query) : null;
        const response = await Got.get(
            `${this.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags${queryString ? `?${queryString}` : ""}`,
            {
                ...this.gotDefaultOptions
            }
        ).json();
        const linkObj = this._decorateLinks(response.headers.link, this.searchTagsByProjectId, [projectId], query);
        return {
            tags: response.body,
            _link: linkObj
        };
    }

    async getMergeRequestByProjectIdAndMergeRequestId(projectId, mergeRequestId) {
        return Got.get(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}/merge_requests/${mergeRequestId}`, {
            ...this.gotDefaultOptions
        }).json();
    }

    async getIssueByProjectIdAndIssueId(projectId, issueId) {
        return Got.get(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}/issues/${issueId}`, {
            ...this.gotDefaultOptions
        }).json();
    }

    async getTagByProjectIdAndTagId(projectId, tagName) {
        return Got.get(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags/${tagName}`, {
            ...this.gotDefaultOptions
        }).json();
    }

    async getCommitByProjectIdAndSha(projectId, sha) {
        return Got.get(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/commits/${sha}`, {
            ...this.gotDefaultOptions
        }).json();
    }

    async findCommitRefsByProjectIdAndSha(projectId, sha, query) {
        const queryString = query ? QueryString.stringify(query) : null;
        return Got.get(
            `${this.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/commits/${sha}/refs${
                queryString ? `?${queryString}` : ""
            }`,
            { ...this.gotDefaultOptions }
        );
    }

    async createTagReleaseByProjectIdTagNameAndTagId(projectId, tagName, body) {
        return Got.post(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags/${tagName}/release`, {
            ...this.gotDefaultOptions,
            json: body
        }).json();
    }

    async updateTagReleaseByProjectIdTagNameAndTagId(projectId, tagName, body) {
        return Got.put(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags/${tagName}/release`, {
            ...this.gotDefaultOptions,
            json: body
        }).json;
    }
};
