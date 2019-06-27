const Generator = require("./lib/generator");
const Logger = require("./logger");

(async () => {
  try {
    await Generator.generate();
  } catch (err) {
    Logger.error(err);
  }
})();