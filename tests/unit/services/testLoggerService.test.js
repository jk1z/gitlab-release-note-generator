const MockDate = require("mockdate");
const LoggerService = require("../../../app/services/logger");
describe("Logger service", () => {
    let loggerService;
    beforeEach(() => {
        MockDate.set("2018-09-07T11:16:17.520Z");
        jest.resetAllMocks();
        loggerService = new LoggerService({ config: { NODE_ENV: "local", TZ: "Australia/Melbourne" } });
        loggerService.console.log = jest.fn();
    });

    afterEach(() => {
        MockDate.reset();
    });

    test("should log info", () => {
        loggerService.info(`test`);
        expect(loggerService.console.log).toBeCalledTimes(1);
        expect(loggerService.console.log.mock.calls[0][0]).toMatchSnapshot();
    });
    test("should log warn", () => {
        loggerService.warn(`test`);
        expect(loggerService.console.log).toBeCalledTimes(1);
        expect(loggerService.console.log.mock.calls[0][0]).toMatchSnapshot();
    });
    test("should log debug", () => {
        loggerService.debug(`test`);
        expect(loggerService.console.log).toBeCalledTimes(1);
        expect(loggerService.console.log.mock.calls[0][0]).toMatchSnapshot();
    });
    test("should log error", () => {
        loggerService.error(`test`);
        expect(loggerService.console.log).toBeCalledTimes(1);
        expect(loggerService.console.log.mock.calls[0][0]).toMatchSnapshot();
    });
});
