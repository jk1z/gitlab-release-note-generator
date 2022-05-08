const DecoratorFactory = require("../../../app/decorators");
const GitLabDecorator = require("../../../app/decorators/gitlab");
const SlackDecorator = require("../../../app/decorators/slack");
const Constants = require("../../../app/constants");

describe("DecoratorFactory", () => {
    describe("#create", () => {
        test("should create gitlab decorator", () => {
            const decorator = new DecoratorFactory({ SERVICE_PROVIDER: Constants.SERVICE_PROVIDER_GITLAB }).create({
                changelog: {
                    issues: [],
                    mergeRequests: []
                },
                labelConfigs: [
                    { name: "issues", title: "Closed issues", default: true },
                    { name: "mergeRequests", title: "Merged merge requests", default: true }
                ],
                tz: "Australia/Melbourne"
            });
            expect(decorator).toBeInstanceOf(GitLabDecorator);
        });
        test("should create slack decorator", () => {
            const decorator = new DecoratorFactory({ SERVICE_PROVIDER: Constants.SERVICE_PROVIDER_SLACK }).create({
                changelog: {
                    issues: [],
                    mergeRequests: []
                },
                labelConfigs: [
                    { name: "issues", title: "Closed issues", default: true },
                    { name: "mergeRequests", title: "Merged merge requests", default: true }
                ],
                tz: "Australia/Melbourne"
            });
            expect(decorator).toBeInstanceOf(SlackDecorator);
        });
        test("should throw error when service type is not supported", () => {
            let err;
            try {
                new DecoratorFactory({ SERVICE_PROVIDER: "unknown" }).create({
                    changelog: {
                        issues: [],
                        mergeRequests: []
                    },
                    labelConfigs: [
                        { name: "issues", title: "Closed issues", default: true },
                        { name: "mergeRequests", title: "Merged merge requests", default: true }
                    ],
                    tz: "Australia/Melbourne"
                });
            } catch (e) {
                err = e;
            }
            expect(err?.message).toBe("Unknown decorator is not implemented");
        });
    });
});
