const Awilix = require("awilix");

const GitlabAdapter = require("./adapters/gitlab");
const GitlabRepository = require("./repositories/gitlab");

module.exports = function configureContainer() {
    const Container = Awilix.createContainer();
    Container.register({
        gitlabAdapter: Awilix.asClass(GitlabAdapter),
        gitlabRepository: Awilix.asClass(GitlabRepository).singleton()
    });
    return Container;
};
