const Constants = require("../constants");
const Utils = require("../utils");
module.exports = class PublisherFactory {
    constructor({ SERVICE_PROVIDER, gitlabAdapter, loggerService }) {
        this.serviceProvider = SERVICE_PROVIDER;
        this.gitlabAdapter = gitlabAdapter;
        this.logger = loggerService;
    }
    create() {
        let Publisher,
            param = { loggerService: this.logger };
        switch (this.serviceProvider) {
            case Constants.SERVICE_PROVIDER_GITLAB:
                Publisher = require("./gitlab");
                param.gitlabAdapter = this.gitlabAdapter;
                break;
            default:
                throw new Error(`${Utils.capitalizeFirstLetter(this.serviceProvider)} publisher is not implemented`);
        }
        return new Publisher(param);
    }
};
