const Env = require("../../../app/env");
const Tag = require("../../../app/lib/tag");
const Gitlab = require("../../../app/adapters/gitlab");

const TagsFixture = [{
    "commit": {
        "id": "2695effb5807a22ff3d138d593fd856244e155e7",
        "short_id": "2695effb",
        "title": "Initial commit",
        "created_at": "2012-05-27T04:42:42Z",
        "parent_ids": [
            "2a4b78934375d7f53875269ffd4f45fd83a84ebe"
        ],
        "message": "Initial commit",
        "author_name": "John Smith",
        "author_email": "john@example.com",
        "authored_date": "2012-05-27T04:42:42Z",
        "committer_name": "Jack Smith",
        "committer_email": "jack@example.com",
        "committed_date": "2012-05-27T04:42:42Z"
    },
    "release": {
        "tag_name": "1.0.0",
        "description": "Amazing release. Wow"
    },
    "name": "v1.0.0",
    "target": "2695effb5807a22ff3d138d593fd856244e155e7",
    "message": null
    },
    {
        "commit": {
            "id": "2695effb5807a22ff3d138d593fd856244e155e7",
            "short_id": "2695effb",
            "title": "Initial commit",
            "created_at": "2012-05-27T04:42:42Z",
            "parent_ids": [
                "2a4b78934375d7f53875269ffd4f45fd83a84ebe"
            ],
            "message": "Initial commit",
            "author_name": "John Smith",
            "author_email": "john@example.com",
            "authored_date": "2012-05-27T04:42:42Z",
            "committer_name": "Jack Smith",
            "committer_email": "jack@example.com",
            "committed_date": "2012-05-27T04:42:42Z"
        },
        "release": {
            "tag_name": "1.0.0",
            "description": "Amazing release. Wow"
        },
        "name": "v1.0.0",
        "target": "2695effb5807a22ff3d138d593fd856244e155e7",
        "message": null
    },
    {
        "commit": {
            "id": "2695effb5807a22ff3d138d593fd856244e155e7",
            "short_id": "2695effb",
            "title": "Initial commit",
            "created_at": "2012-05-27T04:42:42Z",
            "parent_ids": [
                "2a4b78934375d7f53875269ffd4f45fd83a84ebe"
            ],
            "message": "Initial commit",
            "author_name": "John Smith",
            "author_email": "john@example.com",
            "authored_date": "2012-05-27T04:42:42Z",
            "committer_name": "Jack Smith",
            "committer_email": "jack@example.com",
            "committed_date": "2012-05-27T04:42:42Z"
        },
        "release": {
            "tag_name": "1.0.0",
            "description": "Amazing release. Wow"
        },
        "name": "v1.0.0",
        "target": "2695effb5807a22ff3d138d593fd856244e155e7",
        "message": null
    }
];


describe("Tag library", () => {
    describe("#getLatestAndSecondLatestTagByProjectId", () => {
        const setupCommon = async () => {
            jest.mock("../../../app/adapters/gitlab");
            Gitlab.searchTagsByProjectId.mockResolvedValue();
        }
    });
});