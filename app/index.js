const Yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { asValue } = require("awilix");

const Constants = require("./constants");

const ConfigureContainer = require("./configureContainer");
const container = ConfigureContainer();

(async () => {
    try {
        const { argv } = Yargs(hideBin(process.argv))
            .usage(
                "Usage: $0 -GITLAB_API_ENDPOINT [string] " +
                    "-GITLAB_PERSONAL_TOKEN [string] -GITLAB_PROJECT_ID [string] " +
                    "-TARGET_BRANCH [regex string] -TARGET_TAG_REGEX [regex string] " +
                    "-SERVICE_PROVIDER [string] " +
                    "-ISSUE_CLOSED_SECONDS [num] " +
                    "-TZ [string] -NODE_ENV [string]"
            )
            .demandOption(["GITLAB_PERSONAL_TOKEN", "GITLAB_PROJECT_ID"]);

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
        if (!GITLAB_PROJECT_ID) throw new Error("GitLab project id is required");
        if (!GITLAB_PERSONAL_TOKEN) throw new Error("Gitlab personal token is required");
        const config = { ...Constants.defaultOptions };
        if (GITLAB_API_ENDPOINT) config.GITLAB_API_ENDPOINT = GITLAB_API_ENDPOINT;
        if (GITLAB_PERSONAL_TOKEN) config.GITLAB_PERSONAL_TOKEN = GITLAB_PERSONAL_TOKEN;
        if (GITLAB_PROJECT_ID) config.GITLAB_PROJECT_ID = GITLAB_PROJECT_ID;
        if (TARGET_BRANCH) config.TARGET_BRANCH = TARGET_BRANCH;
        if (TARGET_TAG_REGEX) config.TARGET_TAG_REGEX = TARGET_TAG_REGEX;
        if (ISSUE_CLOSED_SECONDS) config.ISSUE_CLOSED_SECONDS = ISSUE_CLOSED_SECONDS;
        if (SERVICE_PROVIDER) config.SERVICE_PROVIDER = SERVICE_PROVIDER;
        if (TZ) config.TZ = TZ;
        if (NODE_ENV) config.NODE_ENV = NODE_ENV;
        container.register({ config: asValue(config) });
        const GitLabReleaseNoteGenerator = container.resolve("gitLabReleaseNoteGenerator");
        await GitLabReleaseNoteGenerator.run();
    } catch (err) {
        console.error(`Fatal error: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
    }
})();
