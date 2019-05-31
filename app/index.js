const Env = require("./env");
const Generator = require("./lib/generator");

(async () => {
    try{
        await Generator.generate();
    } catch(err) {
        console.log(err);
    }
})();