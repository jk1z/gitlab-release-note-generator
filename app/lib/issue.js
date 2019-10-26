const _ = require("lodash");
const Gitlab = require("../adapters/gitlab");


exports.searchIssuesByProjectIdStateStartDateAndEndDate = async (projectId, state, startDate, endDate) => {
  let { issues, _link } = await Gitlab.searchIssuesByProjectId(projectId, {
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
};

exports.decorateIssue = (issue, options = {}) => {
  return options.useSlack ? exports.slackDecorator(issue) : exports.gitLabDecorator(issue)
};

exports.gitLabDecorator = (issue) => {
  return `- ${issue.title} [#${issue.iid}](${issue.web_url})`;
};

exports.slackDecorator = (issue) => {
  return `- ${issue.title} <${issue.web_url}|#${issue.iid}>`
};