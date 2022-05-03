const Yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { asValue } = require("awilix");

const Constants = require("./constants");

const ConfigureContainer = require("./configureContainer");
const container = ConfigureContainer();

(async () => {
    try {
        const argv = Yargs(hideBin(process.argv))
            .usage(
                "Usage: $0 -GITLAB_API_ENDPOINT [string] " +
                    "-GITLAB_PERSONAL_TOKEN [string] -GITLAB_PROJECT_ID [string] " +
                    "-TARGET_BRANCH [regex string] -TARGET_TAG_REGEX [regex string] " +
                    "-SERVICE_PROVIDER [string]" +
                    "-ISSUE_CLOSED_SECONDS [num] " +
                    "-TZ [string] -NODE_ENV [string]"
            )
            .demandOption(["GITLAB_PERSONAL_TOKEN", "GITLAB_PROJECT_ID"]).argv;

        const defaultOptions = {
            GITLAB_API_ENDPOINT: "https://gitlab.com/api/v4",
            NODE_ENV: process.env.NODE_ENV,
            TZ: "Australia/Melbourne",
            SERVICE_PROVIDER: Constants.SERVICE_PROVIDER_GITLAB
        };

        const {
            GITLAB_API_ENDPOINT,
            GITLAB_PERSONAL_TOKEN,
            GITLAB_PROJECT_ID,

            TARGET_BRANCH,
            TARGET_TAG_REGEX,
            ISSUE_CLOSED_SECONDS,
            SERVICE_PROVIDER,

            TZ,
            NODE_ENV
        } = argv;
        if (!GITLAB_PROJECT_ID) throw Error("GitLab project id is required");
        if (!GITLAB_PERSONAL_TOKEN) throw Error("Gitlab personal token is required");
        const config = {
            GITLAB_API_ENDPOINT,
            GITLAB_PERSONAL_TOKEN,
            GITLAB_PROJECT_ID,

            TARGET_BRANCH,
            TARGET_TAG_REGEX,
            ISSUE_CLOSED_SECONDS,
            SERVICE_PROVIDER,

            TZ,
            NODE_ENV,
            ...defaultOptions
        };
        container.register({ config: asValue(config) });
        const GitLabReleaseNoteGenerator = container.resolve("gitLabReleaseNoteGenerator");
        await GitLabReleaseNoteGenerator.run();
    } catch (err) {
        console.error(`Fatal error: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
    }
})();
