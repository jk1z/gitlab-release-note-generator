const ConfigureContainer = require("../../app/configureContainer");
const Nock = require("nock");
const Constants = require("../../app/constants");
const { asValue } = require("awilix");
const GitLabPublisher = require("../../app/publishers/gitlab");

const TagFixtures = require("../fixtures/tag");

jest.mock("../../app/publishers/gitlab");

describe("Gitlab release note generator", () => {
    describe("#run", () => {
        describe("Sunny scenario", () => {
            let generatorApp;
            let searchTagsNock;
            let getProjectNock;
            let searchMRNock;
            let searchIssueNock;
            let searchRefs;
            let container;
            beforeAll(async () => {
                jest.resetAllMocks();
                const GITLAB_API_ENDPOINT = "https://gitlab.com/api/v4";
                const GITLAB_PROJECT_ID = "12345678";
                searchTagsNock = Nock(GITLAB_API_ENDPOINT)
                    .get(`/projects/${GITLAB_PROJECT_ID}/repository/tags`)
                    .reply(200, [TagFixtures.tagDefault()])
                    .persist();
                searchRefs = Nock(GITLAB_API_ENDPOINT)
                    .get(
                        "/projects/12345678/repository/commits/ec0b4f0b5c90ed0fa911a2972ccc452641b31563/refs?type=branch"
                    )
                    .reply(200, [{ type: "branch", name: "master" }]);
                // Mock repo api
                getProjectNock = Nock(GITLAB_API_ENDPOINT)
                    .get(`/projects/${GITLAB_PROJECT_ID}`)
                    .reply(200, {
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
                    });
                // Mock MR api
                searchMRNock = Nock(GITLAB_API_ENDPOINT)
                    .get(`/projects/${GITLAB_PROJECT_ID}/merge_requests`)
                    .query({
                        state: "merged",
                        updated_before: "2012-05-27T04:42:42Z",
                        updated_after: "2012-05-26T04:42:42Z"
                    })
                    .reply(200, [
                        {
                            id: 1,
                            iid: 1,
                            project_id: 3,
                            title: "test1",
                            description: "fixed login page css paddings",
                            state: "merged",
                            merged_by: {
                                id: 87854,
                                name: "Douwe Maan",
                                username: "DouweM",
                                state: "active",
                                avatar_url: "https://gitlab.example.com/uploads/-/system/user/avatar/87854/avatar.png",
                                web_url: "https://gitlab.com/DouweM"
                            },
                            merged_at: "2012-05-27T04:42:42Z",
                            closed_by: null,
                            closed_at: null,
                            created_at: "2017-04-29T08:46:00Z",
                            updated_at: "2017-04-29T08:46:00Z",
                            target_branch: "master",
                            source_branch: "test1",
                            upvotes: 0,
                            downvotes: 0,
                            author: {
                                id: 1,
                                name: "Administrator",
                                username: "admin",
                                state: "active",
                                avatar_url: null,
                                web_url: "https://gitlab.example.com/admin"
                            },
                            assignee: {
                                id: 1,
                                name: "Administrator",
                                username: "admin",
                                state: "active",
                                avatar_url: null,
                                web_url: "https://gitlab.example.com/admin"
                            },
                            assignees: [
                                {
                                    name: "Miss Monserrate Beier",
                                    username: "axel.block",
                                    id: 12,
                                    state: "active",
                                    avatar_url:
                                        "http://www.gravatar.com/avatar/46f6f7dc858ada7be1853f7fb96e81da?s=80&d=identicon",
                                    web_url: "https://gitlab.example.com/axel.block"
                                }
                            ],
                            source_project_id: 2,
                            target_project_id: 3,
                            labels: ["Community contribution", "Manage"],
                            work_in_progress: false,
                            milestone: {
                                id: 5,
                                iid: 1,
                                project_id: 3,
                                title: "v2.0",
                                description: "Assumenda aut placeat expedita exercitationem labore sunt enim earum.",
                                state: "closed",
                                created_at: "2015-02-02T19:49:26.013Z",
                                updated_at: "2015-02-02T19:49:26.013Z",
                                due_date: "2018-09-22",
                                start_date: "2018-08-08",
                                web_url: "https://gitlab.example.com/my-group/my-project/milestones/1"
                            },
                            merge_when_pipeline_succeeds: true,
                            merge_status: "can_be_merged",
                            sha: "8888888888888888888888888888888888888888",
                            merge_commit_sha: null,
                            user_notes_count: 1,
                            discussion_locked: null,
                            should_remove_source_branch: true,
                            force_remove_source_branch: false,
                            allow_collaboration: false,
                            allow_maintainer_to_push: false,
                            web_url: "http://gitlab.example.com/my-group/my-project/merge_requests/1",
                            time_stats: {
                                time_estimate: 0,
                                total_time_spent: 0,
                                human_time_estimate: null,
                                human_total_time_spent: null
                            },
                            squash: false,
                            approvals_before_merge: null
                        }
                    ]);
                // Mock issue api
                searchIssueNock = Nock(GITLAB_API_ENDPOINT)
                    .get(`/projects/${GITLAB_PROJECT_ID}/issues`)
                    .query({
                        state: "closed",
                        updated_before: "2012-05-27T04:42:42Z",
                        updated_after: "2012-05-26T04:42:42Z"
                    })
                    .reply(200, [
                        {
                            state: "opened",
                            description: "Ratione dolores corrupti mollitia soluta quia.",
                            author: {
                                state: "active",
                                id: 18,
                                web_url: "https://gitlab.example.com/eileen.lowe",
                                name: "Alexandra Bashirian",
                                avatar_url: null,
                                username: "eileen.lowe"
                            },
                            milestone: {
                                project_id: 1,
                                description: "Ducimus nam enim ex consequatur cumque ratione.",
                                state: "closed",
                                due_date: null,
                                iid: 2,
                                created_at: "2016-01-04T15:31:39.996Z",
                                title: "v4.0",
                                id: 17,
                                updated_at: "2016-01-04T15:31:39.996Z"
                            },
                            project_id: 1,
                            assignees: [
                                {
                                    state: "active",
                                    id: 1,
                                    name: "Administrator",
                                    web_url: "https://gitlab.example.com/root",
                                    avatar_url: null,
                                    username: "root"
                                }
                            ],
                            assignee: {
                                state: "active",
                                id: 1,
                                name: "Administrator",
                                web_url: "https://gitlab.example.com/root",
                                avatar_url: null,
                                username: "root"
                            },
                            updated_at: "2012-05-27T04:42:42Z",
                            closed_at: "2012-05-27T04:42:42Z",
                            closed_by: null,
                            id: 76,
                            title: "Consequatur vero maxime deserunt laboriosam est voluptas dolorem.",
                            created_at: "2012-05-27T04:42:42Z",
                            iid: 6,
                            labels: ["foo", "bar"],
                            upvotes: 4,
                            downvotes: 0,
                            merge_requests_count: 0,
                            user_notes_count: 1,
                            due_date: "2016-07-22",
                            web_url: "http://example.com/example/example/issues/6",
                            weight: null,
                            time_stats: {
                                time_estimate: 0,
                                total_time_spent: 0,
                                human_time_estimate: null,
                                human_total_time_spent: null
                            },
                            has_tasks: true,
                            task_status: "10 of 15 tasks completed",
                            confidential: false,
                            discussion_locked: false,
                            _links: {
                                self: "http://example.com/api/v4/projects/1/issues/76",
                                notes: "`http://example.com/`api/v4/projects/1/issues/76/notes",
                                award_emoji: "http://example.com/api/v4/projects/1/issues/76/award_emoji",
                                project: "http://example.com/api/v4/projects/1"
                            },
                            subscribed: false
                        }
                    ]);

                const config = {
                    GITLAB_API_ENDPOINT,
                    GITLAB_PERSONAL_TOKEN: "mockGitLabPersonalToken",
                    GITLAB_PROJECT_ID,
                    NODE_ENV: "test",
                    ...Constants.defaultOptions
                };
                container = ConfigureContainer();
                container.register({ config: asValue(config) });
                generatorApp = container.resolve("gitLabReleaseNoteGenerator");
                await generatorApp.run();
            });
            afterAll(() => {
                container.dispose();
            });
            test("should query search tags", () => {
                searchTagsNock.done();
            });
            test("should query get project", () => {
                getProjectNock.done();
            });
            test("should query search MRs", () => {
                searchMRNock.done();
            });
            test("should query search issues", () => {
                searchIssueNock.done();
            });
            test("publisher should publish release note", () => {
                expect(GitLabPublisher).toHaveBeenCalledTimes(1);
                const mockGitLabPublisherInstance = GitLabPublisher.mock.instances[0];
                expect(mockGitLabPublisherInstance.publish).toHaveBeenCalledTimes(1);
                expect(mockGitLabPublisherInstance.publish.mock.calls[0][0]).toMatchSnapshot();
            });
        });
    });
});
