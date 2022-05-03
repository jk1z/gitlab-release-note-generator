const Awilix = require("awilix");

const GitlabAdapter = require("./adapters/gitlab");
const GitlabRepository = require("./repositories/gitlab");

const ChangelogService = require("./services/changelog");
const LoggerService = require("./services/logger");
const TagService = require("./services/tag");

const GitLabReleaseNoteGenerator = require("./app");

module.exports = function configureContainer() {
    const Container = Awilix.createContainer();
    Container.register({
        gitlabAdapter: Awilix.asClass(GitlabAdapter),
        gitlabRepository: Awilix.asClass(GitlabRepository),
        changelogService: Awilix.asClass(ChangelogService),
        loggerService: Awilix.asClass(LoggerService),
        tagService: Awilix.asClass(TagService),
        gitLabReleaseNoteGenerator: Awilix.asClass(GitLabReleaseNoteGenerator).singleton()
    });
    return Container;
};
