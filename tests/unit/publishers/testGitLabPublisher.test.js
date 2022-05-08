const GitLabPublisher = require("../../../app/publishers/gitlab");
const GitLabAdapter = require("../../../app/adapters/gitlab");
const Logger = require("../../../app/services/logger");
const TagFixture = require("../../fixtures/tag");

jest.mock("../../../app/services/logger");
jest.mock("../../../app/adapters/gitlab");
describe("GitLab publisher", () => {
    describe("#publish", () => {
        let gitLabPublisher;
        let gitlabAdapter;
        let logger;
        beforeEach(() => {
            jest.resetAllMocks();
            gitlabAdapter = new GitLabAdapter();
            logger = new Logger();
            gitLabPublisher = new GitLabPublisher({ gitlabAdapter, loggerService: logger });
        });
        test("should update release note if release note exists", async () => {
            await gitLabPublisher.publish({
                projectId: "123",
                tag: TagFixture.tagDefault(),
                content: `### Release note (2012-05-27)
#### Closed issues
- Consequatur vero maxime deserunt laboriosam est voluptas dolorem. [#6](http://example.com/example/example/issues/6)
#### Merged merge requests
- test1 [#1](http://gitlab.example.com/my-group/my-project/merge_requests/1) ([admin](https://gitlab.example.com/admin))
`
            });
            const loggerInstance = Logger.mock.instances[0];
            expect(loggerInstance.debug).toHaveBeenCalledTimes(1);
            expect(loggerInstance.debug.mock.calls[0][0]).toMatchSnapshot();
            const gitLabAdapterInstance = GitLabAdapter.mock.instances[0];
            expect(gitLabAdapterInstance.updateTagReleaseByProjectIdTagNameAndTagId).toHaveBeenCalledTimes(1);
            expect(gitLabAdapterInstance.updateTagReleaseByProjectIdTagNameAndTagId.mock.calls[0]).toMatchSnapshot();
        });
        test("should create release note if release note is missing", async () => {
            const mockTag = JSON.parse(JSON.stringify(TagFixture.tagDefault()));
            delete mockTag.release;
            await gitLabPublisher.publish({
                projectId: "123",
                tag: mockTag,
                content: `### Release note (2012-05-27)
#### Closed issues
- Consequatur vero maxime deserunt laboriosam est voluptas dolorem. [#6](http://example.com/example/example/issues/6)
#### Merged merge requests
- test1 [#1](http://gitlab.example.com/my-group/my-project/merge_requests/1) ([admin](https://gitlab.example.com/admin))
`
            });
            const loggerInstance = Logger.mock.instances[0];
            expect(loggerInstance.debug).toHaveBeenCalledTimes(1);
            expect(loggerInstance.debug.mock.calls[0][0]).toMatchSnapshot();
            const gitLabAdapterInstance = GitLabAdapter.mock.instances[0];
            expect(gitLabAdapterInstance.createTagReleaseByProjectIdTagNameAndTagId).toHaveBeenCalledTimes(1);
            expect(gitLabAdapterInstance.createTagReleaseByProjectIdTagNameAndTagId.mock.calls[0]).toMatchSnapshot();
        });
    });
});
