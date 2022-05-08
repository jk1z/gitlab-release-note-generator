const TagService = require("../../../app/services/tag");

const GitlabRepository = require("../../../app/repositories/gitlab");
const LoggerService = require("../../../app/services/logger");
jest.mock("../../../app/repositories/gitlab");
jest.mock("../../../app/services/logger");

const TagFixtures = require("../../fixtures/tag");
const ProjectFixtures = require("../../fixtures/project");

describe("Tag service", () => {
    describe("#getLatestAndSecondLatestTag", () => {
        let tagService;
        let gitlabRepository;
        let loggerService;
        let res;
        describe("Sunny scenario", () => {
            beforeAll(async () => {
                jest.resetAllMocks();
                loggerService = new LoggerService({});
                gitlabRepository = new GitlabRepository({});
                gitlabRepository.findTagsByProjectId.mockResolvedValue({
                    tags: [TagFixtures.tagDefault(), TagFixtures.tagDefaultOther(), TagFixtures.tagDefaultOther2()],
                    _link: jest.fn()
                });
                gitlabRepository.findRepoByProjectId.mockResolvedValue(ProjectFixtures.projectDefault());
                gitlabRepository.findBranchRefsByProjectIdAndSha.mockResolvedValue([{ name: "master" }]);
                tagService = new TagService({
                    gitlabRepository,
                    loggerService,
                    config: {
                        TARGET_BRANCH: "master",
                        TARGET_TAG_REGEX: new RegExp(/^v[0-9]+.[0-9]+.[0-9]+$/),
                        GITLAB_PROJECT_ID: "123456"
                    }
                });
                res = await tagService.getLatestAndSecondLatestTag();
            });
            test("should log info", () => {
                expect(loggerService.info).toBeCalledTimes(2);
                expect(loggerService.info).toMatchSnapshot();
            });
            test("should return latest and second latest tag", () => {
                expect(res).toHaveLength(2);
                expect(res).toMatchSnapshot();
            });
            test("should call findTagsByProjectId", () => {
                expect(gitlabRepository.findTagsByProjectId).toBeCalledTimes(1);
                expect(gitlabRepository.findTagsByProjectId.mock.calls[0]).toMatchSnapshot();
            });
            test("should call findBranchRefsByProjectIdAndSha", () => {
                expect(gitlabRepository.findBranchRefsByProjectIdAndSha).toBeCalledTimes(2);
                expect(gitlabRepository.findBranchRefsByProjectIdAndSha.mock.calls).toMatchSnapshot();
            });
        });
        describe("Optional scenario", () => {
            describe("Only one tag", () => {
                beforeAll(async () => {
                    jest.resetAllMocks();
                    loggerService = new LoggerService({});
                    gitlabRepository = new GitlabRepository({});
                    gitlabRepository.findTagsByProjectId.mockResolvedValue({
                        tags: [TagFixtures.tagDefaultOther2()],
                        _link: jest.fn()
                    });
                    gitlabRepository.findRepoByProjectId.mockResolvedValue(ProjectFixtures.projectDefault());
                    gitlabRepository.findBranchRefsByProjectIdAndSha.mockResolvedValue([{ name: "master" }]);
                    tagService = new TagService({
                        gitlabRepository,
                        loggerService,
                        config: {
                            TARGET_BRANCH: "master",
                            TARGET_TAG_REGEX: new RegExp(/^v[0-9]+.[0-9]+.[0-9]+$/),
                            GITLAB_PROJECT_ID: "123456"
                        }
                    });
                    res = await tagService.getLatestAndSecondLatestTag();
                });
                test("should log info", () => {
                    expect(loggerService.info).toBeCalledTimes(2);
                    expect(loggerService.info).toMatchSnapshot();
                });
                test("should return latest and second latest tag", () => {
                    expect(res).toHaveLength(2);
                    expect(res).toMatchSnapshot();
                });
                test("should call findTagsByProjectId", () => {
                    expect(gitlabRepository.findTagsByProjectId).toBeCalledTimes(1);
                    expect(gitlabRepository.findTagsByProjectId.mock.calls[0]).toMatchSnapshot();
                });
                test("should call findRepoByProjectId", () => {
                    expect(gitlabRepository.findRepoByProjectId).toBeCalledTimes(1);
                    expect(gitlabRepository.findRepoByProjectId.mock.calls[0]).toMatchSnapshot();
                });
                test("should call findBranchRefsByProjectIdAndSha", () => {
                    expect(gitlabRepository.findBranchRefsByProjectIdAndSha).toBeCalledTimes(1);
                    expect(gitlabRepository.findBranchRefsByProjectIdAndSha.mock.calls).toMatchSnapshot();
                });
            });
        });
        describe("Boom scenario", () => {
            let err;
            describe("Latest tag is not matching the regex", () => {
                beforeAll(async () => {
                    jest.resetAllMocks();
                    loggerService = new LoggerService({});
                    gitlabRepository = new GitlabRepository({});
                    gitlabRepository.findTagsByProjectId.mockResolvedValue({
                        tags: [TagFixtures.tagDefault(), TagFixtures.tagDefaultOther(), TagFixtures.tagDefaultOther2()],
                        _link: jest.fn()
                    });
                    gitlabRepository.findBranchRefsByProjectIdAndSha.mockResolvedValue([{ name: "develop" }]);
                    tagService = new TagService({
                        gitlabRepository,
                        loggerService,
                        config: {
                            TARGET_TAG_REGEX: new RegExp(/^[0-9]+.[0-9]+.[0-9]+$/),
                            GITLAB_PROJECT_ID: "123456"
                        }
                    });
                    try {
                        res = await tagService.getLatestAndSecondLatestTag();
                    } catch (e) {
                        err = e;
                    }
                });
                it("should throw err", () => {
                    expect(err.message).toMatchSnapshot();
                });
            });
            describe("Latest tag is not in the targeting branch", () => {
                beforeAll(async () => {
                    jest.resetAllMocks();
                    loggerService = new LoggerService({});
                    gitlabRepository = new GitlabRepository({});
                    gitlabRepository.findTagsByProjectId.mockResolvedValue({
                        tags: [TagFixtures.tagDefault(), TagFixtures.tagDefaultOther(), TagFixtures.tagDefaultOther2()],
                        _link: jest.fn()
                    });
                    gitlabRepository.findBranchRefsByProjectIdAndSha.mockResolvedValue([{ name: "master" }]);
                    tagService = new TagService({
                        gitlabRepository,
                        loggerService,
                        config: {
                            TARGET_BRANCH: "develop",
                            GITLAB_PROJECT_ID: "123456"
                        }
                    });
                    try {
                        res = await tagService.getLatestAndSecondLatestTag();
                    } catch (e) {
                        err = e;
                    }
                });
                it("should throw err", () => {
                    expect(err.message).toMatchSnapshot();
                });
            });
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
