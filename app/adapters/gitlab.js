const request = require('request-promise-native');
const Env = require("../env");
const QueryString = require("querystring");

const options = {
    headers: {
        "Private-Token": Env.GITLAB_PERSONAL_TOKEN
    },
    json: true
};

exports.getRepoByProjectId = async (projectId) => {
    return request({ uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}`,...options})
};

exports.searchMergeRequestByProjectId = async (projectId, query) => {
    const queryString = query ? QueryString.stringify(query) : null;
    return request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/merge_requests${queryString ? `?${queryString}` : ""}`,...options});
};

exports.searchIssuesByProjectId = async (projectId, query) => {
    const queryString = query ? QueryString.stringify(query) : null;
    return request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/issues${queryString ? `?${queryString}` : ""}`,...options});
};

exports.searchTagsByProjectId = async (projectId, query) => {
    const queryString = query ? QueryString.stringify(query) : null;
    return request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags${queryString ? `?${queryString}` : ""}`,...options});
};

exports.getMergeRequestByProjectIdAndMergeRequestId = async (projectId, mergeRequestId) => {
    return request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/merge_requests/${mergeRequestId}`, ...options})
};

exports.getIssueByProjectIdAndIssueId = async (projectId, issueId) => {
    return request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/issues/${issueId}`, ...options});
};

exports.getTagByProjectIdAndTagId = async (projectId, tagName) => {
    return request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags/${tagName}`, ...options});
};

exports.getCommitByProjectIdAndSha = async (projectId, sha) => {
    return request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/commits/${sha}`, ...options});
};

// {
//     "description": "Amazing release. Wow"
// }
exports.createTagReleaseByProjectIdTagNameAndTagId = async (projectId, tagName, body) => {
    return request({uri: `${Env.GITLAB_API_ENDPOINT}/projects/${projectId}/repository/tags/${tagName}/release`, method: "POST", body, ...options});
};

