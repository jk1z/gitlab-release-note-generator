const crypto = require("crypto");

exports.sha1 = (data) => {
  return crypto.createHash("sha1").update(data, "utf8").digest("hex");
};

exports.commitSha = (data) => {
  const sha = exports.sha1(data);
  return [sha, sha.substring(sha.length - 8)]
};