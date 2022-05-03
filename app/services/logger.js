const Chalk = require("chalk");
const Moment = require("moment-timezone");

module.exports = class LoggerService {
    constructor({ config }) {
        this.config = config;
        if (this.config.NODE_ENV === "test") this.console.log = () => {};
    }

    debug(message) {
        // eslint-disable-next-line no-console
        console.log(Chalk.whiteBright(`${Moment.tz(this.config.TZ).format()} [DEBUG] ${message}`));
    }
    info(message) {
        // eslint-disable-next-line no-console
        console.log(Chalk.greenBright(`${Moment.tz(this.config.TZ).format()} [INFO] ${message}`));
    }
    warn(message) {
        // eslint-disable-next-line no-console
        console.log(Chalk.yellowBright(`${Moment.tz(this.config.TZ).format()} [WARN] ${message}`));
    }
    error(message) {
        // eslint-disable-next-line no-console
        console.log(Chalk.redBright(`${Moment.tz(this.config.TZ).format()} [ERROR] ${message}`));
    }
};
