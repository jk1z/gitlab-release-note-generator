const _ = require("lodash");
const Tag = require("../../../app/lib/tag");
const Gitlab = require("../../../app/adapters/gitlab");
const Env = require("../../../app/env");
const { when } = require("jest-when");

const TagsFixture = require("../../fixtures/tag");
const ProjectFixture = require("../../fixtures/project");



describe("Tag library", () => {
    let mockProject;
    let mockTags;
    let result;
    describe("#getLatestAndSecondLatestTagByProjectId", () => {
        const setupCommon = () => {
            mockProject = ProjectFixture.projectDefault;
            mockTags = TagsFixture.tags;
            Gitlab.searchTagsByProjectId = jest.fn();
            Gitlab.searchTagsByProjectId.mockResolvedValue({tags: _.cloneDeep(mockTags)});
            Gitlab.findCommitRefsByProjectIdAndSha = jest.fn();
            when(Gitlab.findCommitRefsByProjectIdAndSha)
              .calledWith(mockProject.id, mockTags[0].commit.id, {type: "branch"}).mockResolvedValue([{"type": "branch", "name": "develop"}])
              .calledWith(mockProject.id, mockTags[1].commit.id, {type: "branch"}).mockResolvedValue([{"type": "branch", "name": "master"}, {"type": "branch", "name": "mockBranchOther"}])
              .calledWith(mockProject.id, mockTags[2].commit.id, {type: "branch"}).mockResolvedValue([{"type": "branch", "name": "develop"}, {"type": "branch", "name": "mockBranchOther"}])

        };
        describe("Sunny scenario", () => {
            beforeAll(async () => {
                setupCommon();
                result = await Tag.getLatestAndSecondLatestTagByProjectId(mockProject.id);
            });
            test("should return 2 tags", () => {
                expect(result).toHaveLength(2);
            });
            test("should return latest and second latest tag", () => {
                expect(result[0]).toEqual(mockTags[0]);
                expect(result[1]).toEqual(mockTags[1]);
            });
        });

        describe("Other scenario", () => {
            beforeAll(async () => {
                setupCommon();
                Env.TARGET_BRANCH = "develop";
                Env.TARGET_TAG_REGEX = "^v[0-9]+.[0-9]+.[0-9]+(-[0-9]+)?$";
                result = await Tag.getLatestAndSecondLatestTagByProjectId(mockProject.id);
            });
            test("should return 2 tags", () => {
                expect(result).toHaveLength(2);
            });
            test("should return latest and second latest tag", () => {
                expect(result[0]).toEqual(mockTags[0]);
                expect(result[1]).toEqual(mockTags[1]);
            });
        });
    });
});