const Chalk = require("chalk");
const Moment = require("moment-timezone");

module.exports = class Logger {
    constructor({ config, console }) {
        this.config = config;
        this.console = console;
        if (this.config.NODE_ENV === "test") this.console.log = () => {};
    }

    debug(message) {
        // eslint-disable-next-line no-console
        this.console.log(Chalk.whiteBright(`${Moment.tz(this.config.TZ).format()} [DEBUG] ${message}`));
    }
    info(message) {
        // eslint-disable-next-line no-console
        this.console.log(Chalk.greenBright(`${Moment.tz(this.config.TZ).format()} [INFO] ${message}`));
    }
    warn(message) {
        // eslint-disable-next-line no-console
        this.console.log(Chalk.yellowBright(`${Moment.tz(this.config.TZ).format()} [WARN] ${message}`));
    }
    error(message) {
        // eslint-disable-next-line no-console
        this.console.log(Chalk.redBright(`${Moment.tz(this.config.TZ).format()} [ERROR] ${message}`));
    }
};
