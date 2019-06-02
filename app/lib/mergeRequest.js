const _ = require("lodash");
const Gitlab = require("../adapters/gitlab");

// TODO use labels or branch name to determine if it's a enhancement, breaking change or a patch

exports.getMergeRequestByProjectIdStateStartDateAndEndDate = async (projectId, state, startDate, endDate) => {
    let {mergeRequests, _link} = await Gitlab.searchMergeRequestsByProjectId(projectId, {state, updated_before: endDate, updated_after: startDate});
    while (_.get(_link, "next")){
        const res = await _link.next();
        mergeRequests = [...mergeRequests, ...res.mergeRequests];
        _link = res._link;
    }
    return mergeRequests;
};

exports.formatMergeRequest = (mergeRequest) => {
    // Sample: Sample MR #1 (username)
    return `${mergeRequest.title} [#${mergeRequest.iid}](${mergeRequest.web_url}) ([${_.get(mergeRequest, "author.username")}](${_.get(mergeRequest, "author.web_url")}))`
};