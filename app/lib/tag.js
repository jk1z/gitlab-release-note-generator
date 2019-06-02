const _ = require("lodash");
const Gitlab = require("../adapters/gitlab");
const Logger = require("../logger");

exports.getDateRangeFromLatestAndSecondLatestTagByProjectId = async (projectId) => { // TODO: Add regex option to test the tags?
    let {tags} = await Gitlab.searchTagsByProjectId(projectId);
    // Only get the latest and second latest one
    if (!_.isEmpty(tags)) {
        if (tags.length === 1){
            const project = await Gitlab.getRepoByProjectId(projectId);
            return [_.get(tags[0], "commit.committed_date"), project.created_at]
        } else {
            tags = tags.slice(0, 2);
            return tags.map((tag) => {
                return _.get(tag, "commit.committed_date");
            });
        }
    }
    return [];
};

exports.getLatestTagByProjectId = async (projectId) => {
    const {tags} = await Gitlab.searchTagsByProjectId(projectId);
    if (!_.isEmpty(tags)){
        return tags[0];
    }
    return null;
};

exports.upsertTagDescriptionByProjectIdAndTag = async (projectId, tag, description) => {
    if (_.get(tag, "release.description")){
        Logger.debug(`Updating the release note`);
        return Gitlab.updateTagReleaseByProjectIdTagNameAndTagId(projectId, tag.name, {description})
    } else {
      Logger.debug(`Creating a new release note`);
        return Gitlab.createTagReleaseByProjectIdTagNameAndTagId(projectId, tag.name, {description})
    }
};