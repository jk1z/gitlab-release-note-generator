const TagService = require("../../../app/services/tag");

const GitlabRepository = require("../../../app/repositories/gitlab");
const LoggerService = require("../../../app/services/logger");
jest.mock("../../../app/repositories/gitlab");
jest.mock("../../../app/services/logger");

describe("Tag service", () => {
    describe("#getLatestAndSecondLatestTag", () => {
        let tagService;
        describe("Sunny scenario", () => {
            beforeAll(() => {
                const loggerService = new LoggerService({});
                const gitlabRepository = new GitlabRepository({});
                tagService = new TagService({ gitlabRepository, loggerService, config: {} });
            });
        });
        describe("Optional scenario", () => {
            describe("Only one tag", () => {});
            describe("Latest tag is not matching the regex", () => {});
            describe("Latest tag is not in the targeting branch", () => {});
        });
    });
    describe("#isTagsMatchTargetTagRegex", () => {
        let tagService;
        beforeAll(() => {
            const loggerService = new LoggerService({});
            const gitlabRepository = new GitlabRepository({});
            tagService = new TagService({ gitlabRepository, loggerService, config: {} });
        });
        test("should return true when tag matches regex", () => {
            const result = tagService.isTagsMatchTargetTagRegex([{ name: "1.1.0" }], /^[0-9]+.[0-9]+.[0-9]+$/);
            expect(result).toBeTruthy();
        });
        test("should return false when tag doesn't match regex", () => {
            const result = tagService.isTagsMatchTargetTagRegex([{ name: "1.1.0-1" }], /^[0-9]+.[0-9]+.[0-9]+$/);
            expect(result).toBeFalsy();
        });
        test("should return true when regex is missing", () => {
            const result = tagService.isTagsMatchTargetTagRegex([{ name: "1.1.0-1" }], undefined);
            expect(result).toBeTruthy();
        });
    });
    describe("#isBranchesInTargetBranch", () => {
        let tagService;
        beforeAll(() => {
            const loggerService = new LoggerService({});
            const gitlabRepository = new GitlabRepository({});
            tagService = new TagService({ gitlabRepository, loggerService, config: {} });
        });
        test("should return true when branch contains target branch", () => {
            const result = tagService.isBranchesInTargetBranch([{ name: "master" }], "master");
            expect(result).toBeTruthy();
        });
        test("should return false when branch doesn't contain target branch", () => {
            const result = tagService.isBranchesInTargetBranch([{ name: "develop" }], "master");
            expect(result).toBeFalsy();
        });
        test("should return true when target branch is missing", () => {
            const result = tagService.isBranchesInTargetBranch([{ name: "develop" }], undefined);
            expect(result).toBeTruthy();
        });
    });
});
