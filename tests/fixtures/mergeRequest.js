module.exports = {
    mergeRequestDefault: () => {
        return JSON.parse(
            JSON.stringify({
                id: 1,
                iid: 1,
                project_id: 3,
                title: "Mock merge request 1",
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
                merged_at: "2018-09-07T11:16:17.520Z",
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
                        avatar_url: "http://www.gravatar.com/avatar/46f6f7dc858ada7be1853f7fb96e81da?s=80&d=identicon",
                        web_url: "https://gitlab.example.com/axel.block"
                    }
                ],
                source_project_id: 2,
                target_project_id: 3,
                labels: ["features"],
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
            })
        );
    },
    mergeRequestDefaultOther: () => {
        return JSON.parse(
            JSON.stringify({
                id: 1,
                iid: 2,
                project_id: 3,
                title: "Mock merge request 2",
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
                merged_at: "2018-09-07T11:16:17.520Z",
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
                        avatar_url: "http://www.gravatar.com/avatar/46f6f7dc858ada7be1853f7fb96e81da?s=80&d=identicon",
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
            })
        );
    }
};
