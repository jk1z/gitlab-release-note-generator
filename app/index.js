// const Generator = require("./lib/generator");
// const Logger = require("./logger");
//
// Generator.generate()
//     .then()
//     .catch((err) => {
//         Logger.error(err);
//     });
const ConfigureContainer = require("./configureContainer");

const container = ConfigureContainer();
container.resolve();
