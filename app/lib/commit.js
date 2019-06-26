const Gitlab = require("../adapters/gitlab");

exports.findBranchRefsByProjectIdAndSha = async (projectId, sha) => {
    return Gitlab.findCommitRefsByProjectIdAndSha(projectId, sha, {type: "branch"});
};