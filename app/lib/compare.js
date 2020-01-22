const Gitlab = require("../adapters/gitlab");

exports.getCompareForLatestAndSecondLatestTag = async (projectId, latestTag, secondLatestTag) => {
  const repository = await Gitlab.getRepoByProjectId(projectId);

  return {
    text: `List of commits ${secondLatestTag.name}...${latestTag.name}`,
    url: `${repository.web_url}/compare/${secondLatestTag.name}...${latestTag.name}`,
  };
};