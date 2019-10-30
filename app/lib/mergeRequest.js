const _ = require("lodash");
const Gitlab = require("../adapters/gitlab");

exports.getMergeRequestByProjectIdStateStartDateAndEndDate = async (projectId, state, startDate, endDate) => {
  let { mergeRequests, _link } = await Gitlab.searchMergeRequestsByProjectId(projectId, {
    state,
    updated_before: endDate,
    updated_after: startDate
  });
  while (_.get(_link, "next")) {
    const res = await _link.next();
    mergeRequests = [...mergeRequests, ...res.mergeRequests];
    _link = res._link;
  }
  return mergeRequests;
};

exports.decorateMergeRequest = (mergeRequest, options = {}) => {
  return options.useSlack ? exports.slackDecorator(mergeRequest) : exports.gitLabDecorator(mergeRequest)
};

exports.slackDecorator = (mergeRequest) => {
  return `- ${mergeRequest.title} <${mergeRequest.web_url}|#${mergeRequest.iid}> (<${_.get(mergeRequest, "author.web_url")}|${_.get(mergeRequest, "author.username")}>)`;
};

exports.gitLabDecorator = (mergeRequest) => {
  return `- ${mergeRequest.title} [#${mergeRequest.iid}](${mergeRequest.web_url}) ([${_.get(mergeRequest, "author.username")}](${_.get(mergeRequest, "author.web_url")}))`;
};