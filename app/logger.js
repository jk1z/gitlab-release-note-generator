const Chalk = require("chalk");
const Moment = require("moment-timezone");
const Env = require("./env");

exports.debug = (message) => {
  console.log(Chalk.whiteBright(`${Moment.tz(Env.TZ).format()} [DEBUG] ${message}`));
};
exports.info = (message) => {
  console.log(Chalk.greenBright(`${Moment.tz(Env.TZ).format()} [INFO] ${message}`));
};
exports.warn = (message) => {
  console.log(Chalk.yellowBright(`${Moment.tz(Env.TZ).format()} [WARN] ${message}`));
};
exports.error = (message) => {
  console.log(Chalk.redBright(`${Moment.tz(Env.TZ).format()} [ERROR] ${message}`));
};

if (Env.NODE_ENV === "test") {
  console.log = () => {};
}
