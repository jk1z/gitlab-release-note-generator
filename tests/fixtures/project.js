module.exports = {
    projectDefault: () => {
        return JSON.parse(
            JSON.stringify({
                id: 12345678,
                description: null,
                default_branch: "master",
                visibility: "private",
                ssh_url_to_repo: "git@example.com:diaspora/diaspora-project-site.git",
                http_url_to_repo: "http://example.com/diaspora/diaspora-project-site.git",
                web_url: "http://example.com/diaspora/diaspora-project-site",
                readme_url: "http://example.com/diaspora/diaspora-project-site/blob/master/README.md",
                tag_list: ["example", "disapora project"],
                owner: {
                    id: 3,
                    name: "Diaspora",
                    created_at: "2012-05-26T04:42:42Z"
                },
                name: "Diaspora Project Site",
                name_with_namespace: "Diaspora / Diaspora Project Site",
                path: "diaspora-project-site",
                path_with_namespace: "diaspora/diaspora-project-site",
                issues_enabled: true,
                open_issues_count: 1,
                merge_requests_enabled: true,
                jobs_enabled: true,
                wiki_enabled: true,
                snippets_enabled: false,
                resolve_outdated_diff_discussions: false,
                container_registry_enabled: false,
                created_at: "2012-05-26T04:42:42Z",
                last_activity_at: "2012-05-27T04:42:42Z",
                creator_id: 3,
                namespace: {
                    id: 3,
                    name: "Diaspora",
                    path: "diaspora",
                    kind: "group",
                    full_path: "diaspora",
                    avatar_url: "http://localhost:3000/uploads/group/avatar/3/foo.jpg",
                    web_url: "http://localhost:3000/groups/diaspora"
                },
                import_status: "none",
                import_error: null,
                permissions: {
                    project_access: {
                        access_level: 10,
                        notification_level: 3
                    },
                    group_access: {
                        access_level: 50,
                        notification_level: 3
                    }
                },
                archived: false,
                avatar_url: "http://example.com/uploads/project/avatar/3/uploads/avatar.png",
                license_url: "http://example.com/diaspora/diaspora-client/blob/master/LICENSE",
                license: {
                    key: "lgpl-3.0",
                    name: "GNU Lesser General Public License v3.0",
                    nickname: "GNU LGPLv3",
                    html_url: "http://choosealicense.com/licenses/lgpl-3.0/",
                    source_url: "http://www.gnu.org/licenses/lgpl-3.0.txt"
                },
                shared_runners_enabled: true,
                forks_count: 0,
                star_count: 0,
                runners_token: "b8bc4a7a29eb76ea83cf79e4908c2b",
                public_jobs: true,
                shared_with_groups: [
                    {
                        group_id: 4,
                        group_name: "Twitter",
                        group_full_path: "twitter",
                        group_access_level: 30
                    },
                    {
                        group_id: 3,
                        group_name: "Gitlab Org",
                        group_full_path: "gitlab-org",
                        group_access_level: 10
                    }
                ],
                repository_storage: "default",
                only_allow_merge_if_pipeline_succeeds: false,
                only_allow_merge_if_all_discussions_are_resolved: false,
                printing_merge_requests_link_enabled: true,
                request_access_enabled: false,
                merge_method: "merge",
                approvals_before_merge: 0,
                statistics: {
                    commit_count: 37,
                    storage_size: 1038090,
                    repository_size: 1038090,
                    wiki_size: 0,
                    lfs_objects_size: 0,
                    job_artifacts_size: 0,
                    packages_size: 0
                },
                _links: {
                    self: "http://example.com/api/v4/projects",
                    issues: "http://example.com/api/v4/projects/1/issues",
                    merge_requests: "http://example.com/api/v4/projects/1/merge_requests",
                    repo_branches: "http://example.com/api/v4/projects/1/repository_branches",
                    labels: "http://example.com/api/v4/projects/1/labels",
                    events: "http://example.com/api/v4/projects/1/events",
                    members: "http://example.com/api/v4/projects/1/members"
                }
            })
        );
    }
};
