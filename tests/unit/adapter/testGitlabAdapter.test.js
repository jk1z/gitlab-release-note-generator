const GitlabAdapter = require("../../../app/adapters/gitlab");

describe("Gitlab adapter", () => {
    describe("#_decorateLinks", () => {
        let linkObj;
        let gitlabAdapter;
        beforeAll(() => {
            jest.resetAllMocks();
            gitlabAdapter = new GitlabAdapter({
                config: {
                    GITLAB_API_ENDPOINT: "https://gitlab.com/api/v4",
                    GITLAB_PROJECT_ID: "12345678"
                }
            });
            gitlabAdapter.searchTagsByProjectId = jest.fn();
            gitlabAdapter.searchTagsByProjectId.mockResolvedValue({});
            linkObj = gitlabAdapter._decorateLinks(
                '<https://gitlab.com/api/v4/projects?membership=false&order_by=created_at&owned=false&page=1&per_page=20&repository_checksum_failed=false&simple=false&sort=desc&starred=false&statistics=false&wiki_checksum_failed=false&with_custom_attributes=false&with_issues_enabled=false&with_merge_requests_enabled=false>; rel="prev", <https://gitlab.com/api/v4/projects?membership=false&order_by=created_at&owned=false&page=3&per_page=20&repository_checksum_failed=false&simple=false&sort=desc&starred=false&statistics=false&wiki_checksum_failed=false&with_custom_attributes=false&with_issues_enabled=false&with_merge_requests_enabled=false>; rel="next", <https://gitlab.com/api/v4/projects?membership=false&order_by=created_at&owned=false&page=1&per_page=20&repository_checksum_failed=false&simple=false&sort=desc&starred=false&statistics=false&wiki_checksum_failed=false&with_custom_attributes=false&with_issues_enabled=false&with_merge_requests_enabled=false>; rel="first"',
                gitlabAdapter.searchTagsByProjectId,
                ["mockProjectId"],
                { mockKey: "mockValue" }
            );
        });

        test("should decorate links if link contains first, last, next and prev", async () => {
            expect(typeof linkObj.first).toBe("function");
            expect(typeof linkObj.next).toBe("function");
            expect(typeof linkObj.prev).toBe("function");
            await linkObj.first();
            await linkObj.next();
            await linkObj.prev();
            expect(gitlabAdapter.searchTagsByProjectId.mock.calls[0]).toEqual([
                "mockProjectId",
                { mockKey: "mockValue", page: "1", per_page: "20" }
            ]);
            expect(gitlabAdapter.searchTagsByProjectId.mock.calls[1]).toEqual([
                "mockProjectId",
                { mockKey: "mockValue", page: "3", per_page: "20" }
            ]);
            expect(gitlabAdapter.searchTagsByProjectId.mock.calls[2]).toEqual([
                "mockProjectId",
                { mockKey: "mockValue", page: "1", per_page: "20" }
            ]);
        });
        test("should not decorate links if link is empty", () => {
            const linkObj = gitlabAdapter._decorateLinks(undefined, null, ["mockProjectId"], { mockKey: "mockValue" });
            expect(linkObj).toStrictEqual({});
        });
    });
});
