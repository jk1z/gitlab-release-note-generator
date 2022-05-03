const Constants = require("../constants");
const Utils = require("../utils");
module.exports = class DecoratorFactory {
    constructor({ SERVICE_PROVIDER }) {
        this.serviceProvider = SERVICE_PROVIDER;
    }
    create(param) {
        let Decorator;
        switch (this.serviceProvider) {
            case Constants.SERVICE_PROVIDER_GITLAB:
                Decorator = require("./gitlab");
                break;
            case Constants.SERVICE_PROVIDER_SLACK:
                Decorator = require("./slack");
                break;
            default:
                throw new Error(`${Utils.capitalizeFirstLetter(this.serviceProvider)} decorator is not implemented`);
        }
        return new Decorator(param);
    }
};
