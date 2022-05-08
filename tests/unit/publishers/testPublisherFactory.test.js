const PublisherFactory = require("../../../app/publishers");
const GitLabPublisher = require("../../../app/publishers/gitlab");
const Constants = require("../../../app/constants");

describe("DecoratorFactory", () => {
    describe("#create", () => {
        test("should create gitlab Publisher", () => {
            const publisher = new PublisherFactory({
                SERVICE_PROVIDER: Constants.SERVICE_PROVIDER_GITLAB,
                gitlabAdapter: {},
                loggerService: {}
            }).create({});
            expect(publisher).toBeInstanceOf(GitLabPublisher);
        });
        test("should throw error when service type is not supported", () => {
            let err;
            try {
                new PublisherFactory({ SERVICE_PROVIDER: "unknown" }).create({});
            } catch (e) {
                err = e;
            }
            expect(err?.message).toBe("Unknown publisher is not implemented");
        });
    });
});
