const Gitlab = require("../adapters/gitlab");

exports.getProjectName = async (projectId) => {
  const { name } = await Gitlab.getProjectByProjectID(projectId);

  return name;
};
