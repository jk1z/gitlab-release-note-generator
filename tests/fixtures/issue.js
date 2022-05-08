module.exports = {
    issueDefault: () => {
        return JSON.parse(
            JSON.stringify({
                state: "closed",
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
                updated_at: "2016-01-04T15:31:51.081Z",
                closed_at: null,
                closed_by: null,
                id: 75,
                title: "Mock Issue 1",
                created_at: "2016-01-04T15:31:51.081Z",
                iid: 5,
                labels: ["foo", "bar"],
                upvotes: 4,
                downvotes: 0,
                merge_requests_count: 0,
                user_notes_count: 1,
                due_date: "2016-07-22",
                web_url: "http://example.com/example/example/issues/5",
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
            })
        );
    },
    issueDefaultOther: () => {
        return JSON.parse(
            JSON.stringify({
                state: "closed",
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
                updated_at: "2016-01-04T15:31:51.081Z",
                closed_at: null,
                closed_by: null,
                id: 76,
                title: "mock issue 2",
                created_at: "2016-01-04T15:31:51.081Z",
                iid: 6,
                labels: ["fixes"],
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
            })
        );
    }
};
