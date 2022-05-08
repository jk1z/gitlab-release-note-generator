const Got = require("got");
const LinkHeaderParse = require("parse-link-header");

module.exports = class GitlabAdapter {
    constructor({ config }) {
        this.GITLAB_PERSONAL_TOKEN = config.GITLAB_PERSONAL_TOKEN;
        this.GITLAB_API_ENDPOINT = config.GITLAB_API_ENDPOINT;
        this.gotDefaultOptions = {
            headers: { "Private-Token": this.GITLAB_PERSONAL_TOKEN },
            responseType: "json"
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
        const response = await Got.get(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}`, {
            ...this.gotDefaultOptions
        });
        return response.body;
    }

    async searchMergeRequestsByProjectId(projectId, query) {
        const queryString = query ? new URLSearchParams(query).toString() : null;
        const response = await Got.get(
            `${this.GITLAB_API_ENDPOINT}/projects/${projectId}/merge_requests${queryString ? `?${queryString}` : ""}`,
            { ...this.gotDefaultOptions }
        );
        const linkObj = this._decorateLinks(
            response.headers.link,
            this.searchMergeRequestsByProjectId,
            [projectId],
            query
        );
        return {
            mergeRequests: response.body || [],
            _link: linkObj
        };
    }

    async searchIssuesByProjectId(projectId, query) {
        const queryString = query ? new URLSearchParams(query).toString() : null;
        const response = await Got.get(
            `${this.GITLAB_API_ENDPOINT}/projects/${projectId}/issues${queryString ? `?${queryString}` : ""}`,
            {
                ...this.gotDefaultOptions
            }
        );
        const linkObj = this._decorateLinks(response.headers.link, this.searchIssuesByProjectId, [projectId], query);
        return {
            issues: response.body || [],
            _link: linkObj
        };
    }

    async searchTagsByProjectId(projectId, query) {
        const queryString = query ? new URLSearchParams(query).toString() : null;
        const response = await Got.get(
            `${this.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags${queryString ? `?${queryString}` : ""}`,
            {
                ...this.gotDefaultOptions
            }
        );
        const linkObj = this._decorateLinks(response.headers.link, this.searchTagsByProjectId, [projectId], query);
        return {
            tags: response.body,
            _link: linkObj
        };
    }

    async findCommitRefsByProjectIdAndSha(projectId, sha, query) {
        const queryString = query ? new URLSearchParams(query).toString() : null;
        const response = await Got.get(
            `${this.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/commits/${sha}/refs${
                queryString ? `?${queryString}` : ""
            }`,
            { ...this.gotDefaultOptions }
        );
        return response.body;
    }

    async createTagReleaseByProjectIdTagNameAndTagId(projectId, tagName, body) {
        const response = await Got.post(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}/releases`, {
            ...this.gotDefaultOptions,
            json: { ...body, tagName }
        });
        return response.body;
    }

    async updateTagReleaseByProjectIdTagNameAndTagId(projectId, tagName, body) {
        const response = await Got.put(`${this.GITLAB_API_ENDPOINT}/projects/${projectId}/releases/${tagName}`, {
            ...this.gotDefaultOptions,
            json: body
        });
        return response.body;
    }
};
