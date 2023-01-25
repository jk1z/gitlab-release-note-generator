const Yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { asValue } = require("awilix");

const Constants = require("./constants");

const ConfigureContainer = require("./configureContainer");
const container = ConfigureContainer();

(async () => {
    try {
        let env = null;
        if (process.env.GITLAB_PERSONAL_TOKEN && process.env.GITLAB_PROJECT_ID) {
            // eslint-disable-next-line no-console
            console.log(`Detected environment variable. Skipping CLI command.`);
            env = process.env;
        } else {
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
            env = argv;
        }

        if (!env.GITLAB_PROJECT_ID) throw new Error("GitLab project id is required");
        if (!env.GITLAB_PERSONAL_TOKEN) throw new Error("Gitlab personal token is required");
        const config = { ...Constants.defaultOptions };
        if (env.GITLAB_API_ENDPOINT) config.GITLAB_API_ENDPOINT = env.GITLAB_API_ENDPOINT;
        if (env.GITLAB_PERSONAL_TOKEN) config.GITLAB_PERSONAL_TOKEN = env.GITLAB_PERSONAL_TOKEN;
        if (env.GITLAB_PROJECT_ID) config.GITLAB_PROJECT_ID = env.GITLAB_PROJECT_ID;
        if (env.TARGET_BRANCH) config.TARGET_BRANCH = env.TARGET_BRANCH;
        if (env.TARGET_TAG_REGEX) config.TARGET_TAG_REGEX = env.TARGET_TAG_REGEX;
        if (env.ISSUE_CLOSED_SECONDS) config.ISSUE_CLOSED_SECONDS = env.ISSUE_CLOSED_SECONDS;
        if (env.SERVICE_PROVIDER) config.SERVICE_PROVIDER = env.SERVICE_PROVIDER;
        if (env.TZ) config.TZ = env.TZ;
        if (env.NODE_ENV) config.NODE_ENV = env.NODE_ENV;
        container.register({ config: asValue(config) });
        const GitLabReleaseNoteGenerator = container.resolve("gitLabReleaseNoteGenerator");
        await GitLabReleaseNoteGenerator.run();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Fatal error: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
    }
})();
