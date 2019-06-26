const Utils = require("../utils");

module.exports = {
  tags: [
    {
      "commit": {
        "id": Utils.commitSha("commit1")[0],
        "short_id": Utils.commitSha("commit1")[1],
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
        "tag_name": "1.1.0",
        "description": "Amazing release. Wow"
      },
      "name": "v1.1.0",
      "target": Utils.commitSha("commit1")[0],
      "message": null
    },
    {
      "commit": {
        "id": Utils.commitSha("commit2")[0],
        "short_id": Utils.commitSha("commit2")[1],
        "title": "Initial commit",
        "created_at": "2012-05-26T04:42:42Z",
        "parent_ids": [
          "2a4b78934375d7f53875269ffd4f45fd83a84ebf"
        ],
        "message": "Initial commit",
        "author_name": "John Smith",
        "author_email": "john@example.com",
        "authored_date": "2012-05-26T04:42:42Z",
        "committer_name": "Jack Smith",
        "committer_email": "jack@example.com",
        "committed_date": "2012-05-26T04:42:42Z"
      },
      "release": {
        "tag_name": "1.0.0-20",
        "description": "Amazing release. Wow"
      },
      "name": "v1.0.0-20",
      "target": Utils.commitSha("commit2")[0],
      "message": null
    },
    {
      "commit": {
        "id": Utils.commitSha("commit3")[0],
        "short_id": Utils.commitSha("commit3")[1],
        "title": "Initial commit",
        "created_at": "2012-05-25T04:42:42Z",
        "parent_ids": [
          "2a4b78934375d7f53875269ffd4f45fd83a84ebd"
        ],
        "message": "Initial commit",
        "author_name": "John Smith",
        "author_email": "john@example.com",
        "authored_date": "2012-05-25T04:42:42Z",
        "committer_name": "Jack Smith",
        "committer_email": "jack@example.com",
        "committed_date": "2012-05-25T04:42:42Z"
      },
      "release": {
        "tag_name": "1.0.0",
        "description": "Amazing release. Wow"
      },
      "name": "v1.0.0",
      "target": Utils.commitSha("commit3")[0],
      "message": null
    }
  ]
};
