const Request = require('request-promise-native');
const Env = require("../env");
const QueryString = require("querystring");
const LinkHeaderParse = require("parse-link-header");

const options = {
    headers: {
        "Private-Token": Env.GITLAB_PERSONAL_TOKEN
    },
    json: true,
};

const createRequestsByLink = (link, templateFunction, templateArgs, query) => {
    const requests = {};
    if (link) {
        link = LinkHeaderParse(link);
        if (link.first) requests.first = () => templateFunction.apply(null, [templateArgs, {...query, page: link.first.page, per_page: link.first.per_page}]);
        if (link.last) requests.last = () => templateFunction.apply(null, [templateArgs, {...query, page: link.last.page, per_page: link.last.per_page}]);
        if (link.next) requests.next = () => templateFunction.apply(null, [templateArgs, {...query, page: link.next.page, per_page: link.next.per_page}]);
        if (link.prev) requests.prev = () => templateFunction.apply(null, [templateArgs, {...query, page: link.prev.page, per_page: link.prev.per_page}]);
    }
    return requests;
};


exports.getRepoByProjectId = async (projectId) => {
    return Request({ uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}`,...options})
};

exports.searchMergeRequestsByProjectId = async (projectId, query) => {
    const queryString = query ? QueryString.stringify(query) : null;
    const res = await Request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/merge_requests${queryString ? `?${queryString}` : ""}`,...options, resolveWithFullResponse: true});
    return {mergeRequests: res.body, _link: {...createRequestsByLink(res.headers.link, exports.searchMergeRequestsByProjectId, [projectId], query)}}
};

exports.searchIssuesByProjectId = async (projectId, query) => {
    const queryString = query ? QueryString.stringify(query) : null;
    const res = await Request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/issues${queryString ? `?${queryString}` : ""}`,...options, resolveWithFullResponse: true});
    return {issues: res.body, _link: {...createRequestsByLink(res.headers.link, exports.searchIssuesByProjectId, [projectId], query)}}
};

exports.searchTagsByProjectId = async (projectId, query) => {
    const queryString = query ? QueryString.stringify(query) : null;
    const res = await Request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags${queryString ? `?${queryString}` : ""}`,...options, resolveWithFullResponse: true});
    return {tags: res.body, _link: {...createRequestsByLink(res.headers.link, exports.searchTagsByProjectId, [projectId], query)}}
};

exports.getMergeRequestByProjectIdAndMergeRequestId = async (projectId, mergeRequestId) => {
    return Request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/merge_requests/${mergeRequestId}`, ...options})
};

exports.getIssueByProjectIdAndIssueId = async (projectId, issueId) => {
    return Request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/issues/${issueId}`, ...options});
};

exports.getTagByProjectIdAndTagId = async (projectId, tagName) => {
    return Request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags/${tagName}`, ...options});
};

exports.getCommitByProjectIdAndSha = async (projectId, sha) => {
    return Request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/commits/${sha}`, ...options});
};

// {
//     "description": "Amazing release. Wow"
// }
exports.createTagReleaseByProjectIdTagNameAndTagId = async (projectId, tagName, body) => {
    return Request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags/${tagName}/release`, method: "POST", body, ...options});
};

exports.updateTagReleaseByProjectIdTagNameAndTagId = async (projectId, tagName, body) => {
    return Request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags/${tagName}/release`, method: "PUT", body, ...options});
};

