const BaseDecorator = require("../../../app/decorators/base");
describe("Base decorator", () => {
    describe("#populateContentBucketByContents", () => {
        test("should populate content buckets with default label configs", () => {
            const baseDecorator = new BaseDecorator({
                labelConfigs: [
                    { name: "issues", title: "Closed issues", default: true },
                    { name: "mergeRequests", title: "Merged merge requests", default: true }
                ]
            });
            baseDecorator.populateContentBucketByContents([
                { message: "mock issue message", labels: [], defaultLabel: "issues" },
                { message: "mock MR message", labels: [], defaultLabel: "mergeRequests" }
            ]);
            expect(baseDecorator.labelBucket).toMatchSnapshot();
        });
        test("should populate content buckets with custom label configs", () => {
            const baseDecorator = new BaseDecorator({
                labelConfigs: [
                    { name: "issues", title: "Closed issues", default: true },
                    { name: "mergeRequests", title: "Merged merge requests", default: true },
                    { name: "features", title: "Features" },
                    { name: "fixes", title: "Bug Fixes" }
                ]
            });
            baseDecorator.populateContentBucketByContents([
                { message: "mock feature message", labels: ["features"], defaultLabel: "issues" },
                { message: "mock fixes message", labels: ["fixes"], defaultLabel: "mergeRequests" }
            ]);
            expect(baseDecorator.labelBucket).toMatchSnapshot();
        });
        test("should populate content buckets with mixed label configs", () => {
            const baseDecorator = new BaseDecorator({
                labelConfigs: [
                    { name: "issues", title: "Closed issues", default: true },
                    { name: "mergeRequests", title: "Merged merge requests", default: true },
                    { name: "features", title: "Features" },
                    { name: "fixes", title: "Bug Fixes" }
                ]
            });
            baseDecorator.populateContentBucketByContents([
                { message: "mock normal MR message", labels: [], defaultLabel: "mergeRequests" },
                { message: "mock normal issue message", labels: [], defaultLabel: "issues" },
                { message: "mock feature message", labels: ["features"], defaultLabel: "issues" },
                { message: "mock fixes message", labels: ["fixes"], defaultLabel: "mergeRequests" }
            ]);
            expect(baseDecorator.labelBucket).toMatchSnapshot();
        });
    });
});
