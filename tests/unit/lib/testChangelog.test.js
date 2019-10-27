const ChangelogLib = require("../../../app/lib/changelog");
const MockDate = require("mockdate");

describe("ChangelogLib lib", () => {
  describe("#createGitLabChangeLog", () => {
    let releaseDate;
    let mergeRequests;
    let issues;
    let changelog;
    const setupCommon = () => {
      MockDate.set(new Date("2019-06-02T06:26:31.000Z"));
      releaseDate = new Date().toISOString();
      mergeRequests = [{
        "id": 1,
        "iid": 1,
        "project_id": 3,
        "title": "test1",
        "description": "fixed login page css paddings",
        "state": "merged",
        "merged_by": {
          "id": 87854,
          "name": "Douwe Maan",
          "username": "DouweM",
          "state": "active",
          "avatar_url": "https://gitlab.example.com/uploads/-/system/user/avatar/87854/avatar.png",
          "web_url": "https://gitlab.com/DouweM"
        },
        "merged_at": "2018-09-07T11:16:17.520Z",
        "closed_by": null,
        "closed_at": null,
        "created_at": "2017-04-29T08:46:00Z",
        "updated_at": "2017-04-29T08:46:00Z",
        "target_branch": "master",
        "source_branch": "test1",
        "upvotes": 0,
        "downvotes": 0,
        "author": {
          "id": 1,
          "name": "Administrator",
          "username": "admin",
          "state": "active",
          "avatar_url": null,
          "web_url": "https://gitlab.example.com/admin"
        },
        "assignee": {
          "id": 1,
          "name": "Administrator",
          "username": "admin",
          "state": "active",
          "avatar_url": null,
          "web_url": "https://gitlab.example.com/admin"
        },
        "assignees": [{
          "name": "Miss Monserrate Beier",
          "username": "axel.block",
          "id": 12,
          "state": "active",
          "avatar_url": "http://www.gravatar.com/avatar/46f6f7dc858ada7be1853f7fb96e81da?s=80&d=identicon",
          "web_url": "https://gitlab.example.com/axel.block"
        }],
        "source_project_id": 2,
        "target_project_id": 3,
        "labels": [],
        "work_in_progress": false,
        "milestone": {
          "id": 5,
          "iid": 1,
          "project_id": 3,
          "title": "v2.0",
          "description": "Assumenda aut placeat expedita exercitationem labore sunt enim earum.",
          "state": "closed",
          "created_at": "2015-02-02T19:49:26.013Z",
          "updated_at": "2015-02-02T19:49:26.013Z",
          "due_date": "2018-09-22",
          "start_date": "2018-08-08",
          "web_url": "https://gitlab.example.com/my-group/my-project/milestones/1"
        },
        "merge_when_pipeline_succeeds": true,
        "merge_status": "can_be_merged",
        "sha": "8888888888888888888888888888888888888888",
        "merge_commit_sha": null,
        "user_notes_count": 1,
        "discussion_locked": null,
        "should_remove_source_branch": true,
        "force_remove_source_branch": false,
        "allow_collaboration": false,
        "allow_maintainer_to_push": false,
        "web_url": "http://gitlab.example.com/my-group/my-project/merge_requests/1",
        "time_stats": {
          "time_estimate": 0,
          "total_time_spent": 0,
          "human_time_estimate": null,
          "human_total_time_spent": null
        },
        "squash": false,
        "approvals_before_merge": null
      }];
      issues = [{
        "state": "opened",
        "description": "Ratione dolores corrupti mollitia soluta quia.",
        "author": {
          "state": "active",
          "id": 18,
          "web_url": "https://gitlab.example.com/eileen.lowe",
          "name": "Alexandra Bashirian",
          "avatar_url": null,
          "username": "eileen.lowe"
        },
        "milestone": {
          "project_id": 1,
          "description": "Ducimus nam enim ex consequatur cumque ratione.",
          "state": "closed",
          "due_date": null,
          "iid": 2,
          "created_at": "2016-01-04T15:31:39.996Z",
          "title": "v4.0",
          "id": 17,
          "updated_at": "2016-01-04T15:31:39.996Z"
        },
        "project_id": 1,
        "assignees": [{
          "state": "active",
          "id": 1,
          "name": "Administrator",
          "web_url": "https://gitlab.example.com/root",
          "avatar_url": null,
          "username": "root"
        }],
        "assignee": {
          "state": "active",
          "id": 1,
          "name": "Administrator",
          "web_url": "https://gitlab.example.com/root",
          "avatar_url": null,
          "username": "root"
        },
        "updated_at": "2016-01-04T15:31:51.081Z",
        "closed_at": null,
        "closed_by": null,
        "id": 76,
        "title": "Consequatur vero maxime deserunt laboriosam est voluptas dolorem.",
        "created_at": "2016-01-04T15:31:51.081Z",
        "iid": 6,
        "labels": [],
        "upvotes": 4,
        "downvotes": 0,
        "merge_requests_count": 0,
        "user_notes_count": 1,
        "due_date": "2016-07-22",
        "web_url": "http://example.com/example/example/issues/6",
        "weight": null,
        "time_stats": {
          "time_estimate": 0,
          "total_time_spent": 0,
          "human_time_estimate": null,
          "human_total_time_spent": null
        },
        "has_tasks": true,
        "task_status": "10 of 15 tasks completed",
        "confidential": false,
        "discussion_locked": false,
        "_links": {
          "self": "http://example.com/api/v4/projects/1/issues/76",
          "notes": "`http://example.com/`api/v4/projects/1/issues/76/notes",
          "award_emoji": "http://example.com/api/v4/projects/1/issues/76/award_emoji",
          "project": "http://example.com/api/v4/projects/1"
        },
        "subscribed": false
      }];
    };
    const cleanUpCommon = () => {
      MockDate.reset();
    };
    describe("With labels", () => {
      beforeAll(async () => {
        setupCommon();
        issues[0].labels = ["breaking change", "enhancement"];
        mergeRequests[0].labels = ["bug", "feature"];
        changelog = await ChangelogLib.generateChangeLogContent({releaseDate, issues, mergeRequests});
      });
      afterAll(() => {
        cleanUpCommon();
      });
      test("should render changelog in markdown", () => {
        expect(changelog).toEqual("### Release note (2019-06-02)\n" +
          "#### Notable changes\n" +
          "- Consequatur vero maxime deserunt laboriosam est voluptas dolorem. [#6](http://example.com/example/example/issues/6)\n" +
          "#### Enhancements\n" +
          "- Consequatur vero maxime deserunt laboriosam est voluptas dolorem. [#6](http://example.com/example/example/issues/6)\n" +
          "#### New features\n" +
          "- test1 [#1](http://gitlab.example.com/my-group/my-project/merge_requests/1) ([admin](https://gitlab.example.com/admin))\n" +
          "#### Fixed bugs\n" +
          "- test1 [#1](http://gitlab.example.com/my-group/my-project/merge_requests/1) ([admin](https://gitlab.example.com/admin))\n" +
          "#### Closed issues\n" +
          "#### Merged merge requests\n")
      });
    });
    describe("Without labels", () => {
      beforeAll(async () => {
        setupCommon();
        changelog = await ChangelogLib.generateChangeLogContent({releaseDate, issues, mergeRequests});
      });
      afterAll(() => {
        cleanUpCommon();
      });
      test("should render changelog in markdown", () => {
        expect(changelog).toEqual("### Release note (2019-06-02)\n" +
          "#### Closed issues\n" +
          "- Consequatur vero maxime deserunt laboriosam est voluptas dolorem. [#6](http://example.com/example/example/issues/6)\n" +
          "#### Merged merge requests\n" +
          "- test1 [#1](http://gitlab.example.com/my-group/my-project/merge_requests/1) ([admin](https://gitlab.example.com/admin))\n");
      });
    });
  });
});