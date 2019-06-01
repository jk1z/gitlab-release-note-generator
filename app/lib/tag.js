// [
//     {
//         "commit": {
//             "id": "2695effb5807a22ff3d138d593fd856244e155e7",
//             "short_id": "2695effb",
//             "title": "Initial commit",
//             "created_at": "2017-07-26T11:08:53.000+02:00",
//             "parent_ids": [
//                 "2a4b78934375d7f53875269ffd4f45fd83a84ebe"
//             ],
//             "message": "Initial commit",
//             "author_name": "John Smith",
//             "author_email": "john@example.com",
//             "authored_date": "2012-05-28T04:42:42-07:00",
//             "committer_name": "Jack Smith",
//             "committer_email": "jack@example.com",
//             "committed_date": "2012-05-28T04:42:42-07:00"
//         },
//         "release": {
//             "tag_name": "1.0.0",
//             "description": "Amazing release. Wow"
//         },
//         "name": "v1.0.0",
//         "target": "2695effb5807a22ff3d138d593fd856244e155e7",
//         "message": null
//     }
// ]

const _ = require("lodash");
const Gitlab = require("../adapters/gitlab");
const Logger = require("../logger");

// {
//     "id": 3,
//     "description": null,
//     "default_branch": "master",
//     "visibility": "private",
//     "ssh_url_to_repo": "git@example.com:diaspora/diaspora-project-site.git",
//     "http_url_to_repo": "http://example.com/diaspora/diaspora-project-site.git",
//     "web_url": "http://example.com/diaspora/diaspora-project-site",
//     "readme_url": "http://example.com/diaspora/diaspora-project-site/blob/master/README.md",
//     "tag_list": [
//     "example",
//     "disapora project"
// ],
//     "owner": {
//     "id": 3,
//         "name": "Diaspora",
//         "created_at": "2013-09-30T13:46:02Z"
// },
//     "name": "Diaspora Project Site",
//     "name_with_namespace": "Diaspora / Diaspora Project Site",
//     "path": "diaspora-project-site",
//     "path_with_namespace": "diaspora/diaspora-project-site",
//     "issues_enabled": true,
//     "open_issues_count": 1,
//     "merge_requests_enabled": true,
//     "jobs_enabled": true,
//     "wiki_enabled": true,
//     "snippets_enabled": false,
//     "resolve_outdated_diff_discussions": false,
//     "container_registry_enabled": false,
//     "created_at": "2013-09-30T13:46:02Z",
//     "last_activity_at": "2013-09-30T13:46:02Z",
//     "creator_id": 3,
//     "namespace": {
//     "id": 3,
//         "name": "Diaspora",
//         "path": "diaspora",
//         "kind": "group",
//         "full_path": "diaspora",
//         "avatar_url": "http://localhost:3000/uploads/group/avatar/3/foo.jpg",
//         "web_url": "http://localhost:3000/groups/diaspora"
// },
//     "import_status": "none",
//     "import_error": null,
//     "permissions": {
//     "project_access": {
//         "access_level": 10,
//             "notification_level": 3
//     },
//     "group_access": {
//         "access_level": 50,
//             "notification_level": 3
//     }
// },
//     "archived": false,
//     "avatar_url": "http://example.com/uploads/project/avatar/3/uploads/avatar.png",
//     "license_url": "http://example.com/diaspora/diaspora-client/blob/master/LICENSE",
//     "license": {
//     "key": "lgpl-3.0",
//         "name": "GNU Lesser General Public License v3.0",
//         "nickname": "GNU LGPLv3",
//         "html_url": "http://choosealicense.com/licenses/lgpl-3.0/",
//         "source_url": "http://www.gnu.org/licenses/lgpl-3.0.txt"
// },
//     "shared_runners_enabled": true,
//     "forks_count": 0,
//     "star_count": 0,
//     "runners_token": "b8bc4a7a29eb76ea83cf79e4908c2b",
//     "public_jobs": true,
//     "shared_with_groups": [
//     {
//         "group_id": 4,
//         "group_name": "Twitter",
//         "group_full_path": "twitter",
//         "group_access_level": 30
//     },
//     {
//         "group_id": 3,
//         "group_name": "Gitlab Org",
//         "group_full_path": "gitlab-org",
//         "group_access_level": 10
//     }
// ],
//     "repository_storage": "default",
//     "only_allow_merge_if_pipeline_succeeds": false,
//     "only_allow_merge_if_all_discussions_are_resolved": false,
//     "printing_merge_requests_link_enabled": true,
//     "request_access_enabled": false,
//     "merge_method": "merge",
//     "approvals_before_merge": 0,
//     "statistics": {
//     "commit_count": 37,
//         "storage_size": 1038090,
//         "repository_size": 1038090,
//         "wiki_size" : 0,
//         "lfs_objects_size": 0,
//         "job_artifacts_size": 0,
//         "packages_size": 0
// },
//     "_links": {
//     "self": "http://example.com/api/v4/projects",
//         "issues": "http://example.com/api/v4/projects/1/issues",
//         "merge_requests": "http://example.com/api/v4/projects/1/merge_requests",
//         "repo_branches": "http://example.com/api/v4/projects/1/repository_branches",
//         "labels": "http://example.com/api/v4/projects/1/labels",
//         "events": "http://example.com/api/v4/projects/1/events",
//         "members": "http://example.com/api/v4/projects/1/members"
// }
// }
exports.getDateRangeFromLatestAndSecondLatestTagByProjectId = async (projectId) => { // TODO: Add regex option to test the tags?
    let {tags} = await Gitlab.searchTagsByProjectId(projectId);
    // Only get the latest and second latest one
    if (!_.isEmpty(tags)) {
        if (tags.length === 1){
            const project = await Gitlab.getRepoByProjectId(projectId);
            return [project.created_at, _.get(tags[0], "commit.committed_date")]
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