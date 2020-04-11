const Generator = require("./lib/generator");
const Publisher = require("./lib/publisher");
const Logger = require("./logger");

Generator.generate().then(notes => Publisher.publish(notes)).catch(err => {
  Logger.error(err);
});