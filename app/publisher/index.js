const Constants = require("../constants");
const Utils = require("../utils");
module.exports = class NotifierFactory {
    constructor({ SERVICE_PROVIDER, gitlabAdapter }) {
        this.serviceProvider = SERVICE_PROVIDER;
        this.gitlabAdapter = gitlabAdapter;
    }
    create() {
        let Decorator,
            param = {};
        switch (this.serviceProvider) {
            case Constants.SERVICE_PROVIDER_GITLAB:
                Decorator = require("./gitlab");
                param.gitlabAdapter = this.gitlabAdapter;
                break;
            default:
                throw new Error(`${Utils.capitalizeFirstLetter(this.serviceProvider)} publisher is not implemented`);
        }
        return new Decorator(param);
    }
};
