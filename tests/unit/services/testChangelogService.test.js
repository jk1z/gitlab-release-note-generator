const ChangelogService = require("../../../app/services/changelog");

const GitLabRepository = require("../../../app/repositories/gitlab");
const Logger = require("../../../app/services/logger");

const IssueFixtures = require("../../fixtures/issue");
const MergeRequestFixtures = require("../../fixtures/mergeRequest");

jest.mock("../../../app/services/logger");
jest.mock("../../../app/repositories/gitlab");
describe("Changelog service", () => {
    describe("#getChangelogByStartAndEndDate", () => {
        let changelogService;
        let mergeRequests, issues;
        let gitlabRepository;
        let loggerService;
        beforeAll(async () => {
            jest.resetAllMocks();
            gitlabRepository = new GitLabRepository({});
            const mockMergeRequest = MergeRequestFixtures.mergeRequestDefault();
            const mockMergeRequestOther = MergeRequestFixtures.mergeRequestDefaultOther();
            mockMergeRequestOther.merged_at = "2018-08-07T11:15:17.520Z";
            gitlabRepository.findMergeRequestsByProjectIdStateStartDateAndEndDate.mockResolvedValue([
                mockMergeRequest,
                mockMergeRequestOther
            ]);
            const mockIssue = IssueFixtures.issueDefault();
            const mockIssueOther = IssueFixtures.issueDefaultOther();
            mockIssue.closed_at = "2018-09-07T12:15:17.520Z";
            mockIssueOther.closed_at = "2018-08-07T11:15:17.520Z";
            gitlabRepository.findIssuesByProjectIdStateStartDateAndEndDate.mockResolvedValue([
                mockIssue,
                mockIssueOther
            ]);
            loggerService = new Logger({});
            changelogService = new ChangelogService({
                gitlabRepository,
                loggerService,
                config: { TZ: "Australia/Melbourne", GITLAB_PROJECT_ID: "12345" }
            });
            const changelog = await changelogService.getChangelogByStartAndEndDate(
                "2018-09-07T11:15:17.520Z",
                "2018-10-07T11:15:17.520Z"
            );
            mergeRequests = changelog.mergeRequests;
            issues = changelog.issues;
        });
        test("should return issues and merge requests", () => {
            expect(mergeRequests).toHaveLength(1);
            expect(issues).toHaveLength(1);
            expect(mergeRequests).toMatchSnapshot();
            expect(issues).toMatchSnapshot();
        });
        test("should call findMergeRequestsByProjectIdStateStartDateAndEndDate", () => {
            expect(gitlabRepository.findMergeRequestsByProjectIdStateStartDateAndEndDate).toHaveBeenCalledTimes(1);
            expect(
                gitlabRepository.findMergeRequestsByProjectIdStateStartDateAndEndDate.mock.calls[0]
            ).toMatchSnapshot();
        });
        test("should call findIssuesByProjectIdStateStartDateAndEndDate", () => {
            expect(gitlabRepository.findIssuesByProjectIdStateStartDateAndEndDate).toHaveBeenCalledTimes(1);
            expect(gitlabRepository.findIssuesByProjectIdStateStartDateAndEndDate.mock.calls[0]).toMatchSnapshot();
        });
        test("should log info", () => {
            expect(loggerService.info).toHaveBeenCalledTimes(3);
            expect(loggerService.info.mock.calls).toMatchSnapshot();
        });
    });
});
