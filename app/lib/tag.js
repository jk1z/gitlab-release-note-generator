const _ = require("lodash");
const Gitlab = require("../adapters/gitlab");
const Logger = require("../logger");
const Commit = require("./commit");
const Env = require("../env");

exports.isBranchesInTargetBranch = (branches, targetBranchName) => {
  if (!targetBranchName) return true;
  return _.some(branches, branch => branch.name === targetBranchName);
};

exports.isTagsMatchTargetTagRegex = (tags, targetTagRegex) => {
  if (!targetTagRegex) return true;
  return _.some(tags, tag => _.get(tag, "name", "").match(targetTagRegex));
};

exports.getLatestAndSecondLatestTagByProjectId = async (projectId) => {
  let { tags, _link } = await Gitlab.searchTagsByProjectId(projectId);
  if (_.isEmpty(tags)) return [];

  // Only get the latest and second latest one from the same branch
  const latestTag = tags.shift();
  Logger.info(`Latest tag is ${latestTag.name}`);

  if (tags.length === 0) {
    const project = await Gitlab.getRepoByProjectId(projectId);
    Logger.info("No more tag is found. Assuming project creation date is the start date");
    return [latestTag, { commit: { committed_date: project.created_at } }];
  } else {
    let secondLatestTag = null;
    let page = 0;

    if (!exports.isTagsMatchTargetTagRegex([latestTag], Env.TARGET_TAG_REGEX)) throw new Error(`Latest tag doesn't match with the regex. Target tag regex ${Env.TARGET_TAG_REGEX}`);
    const latestBranches = await Commit.findBranchRefsByProjectIdAndSha(projectId, _.get(latestTag, "commit.id", ""));
    if (!exports.isBranchesInTargetBranch(latestBranches, Env.TARGET_BRANCH)) throw new Error(`Latest tag doesn't contain target branch. Target branch ${Env.TARGET_BRANCH}`);

    while (!secondLatestTag) {
      for (const tag of tags) {
        if (exports.isTagsMatchTargetTagRegex([tag], Env.TARGET_TAG_REGEX)) {
          const branches = await Commit.findBranchRefsByProjectIdAndSha(projectId, _.get(latestTag, "commit.id", ""));
          for (const branch of branches) {
            if (exports.isBranchesInTargetBranch(latestBranches, branch.name)) {
              Logger.info(`Found the second latest tag on page ${page + 1}. The second latest tag is ${tag.name}`);
              secondLatestTag = tag;
              break;
            }
          }
        }
        if (secondLatestTag) break;
      }

      if (!secondLatestTag) {
        if (!_.isFunction(_.get(_link, "next"))) break;
        const res = await _link.next();
        tags = res.tags;
        _link = res._link;
        page++;
      }
    }
    return _.uniq([latestTag, secondLatestTag]);
  }
};

exports.getLatestTagByProjectId = async (projectId) => {
  const { tags } = await Gitlab.searchTagsByProjectId(projectId);
  if (!_.isEmpty(tags)) {
    return tags[0];
  }
  return null;
};

exports.upsertTagDescriptionByProjectIdAndTag = async (projectId, tag, description) => {
  if (_.get(tag, "release.description")) {
    Logger.debug(`Updating the release note`);
    return Gitlab.updateTagReleaseByProjectIdTagNameAndTagId(projectId, tag.name, { description });
  } else {
    Logger.debug(`Creating a new release note`);
    return Gitlab.createTagReleaseByProjectIdTagNameAndTagId(projectId, tag.name, { description });
  }
};