const _ = require("lodash");
const request = require("request");
const Project = require("./project");
const Logger = require("../logger");
const Env = require("../env");

exports.publish = async (notes) => {
  if (!Env.PUBLISH_TO_SLACK) {
    Logger.info('PUBLISH_TO_SLACK is disabled. Skipping...');
    return;
  }

  if (!Env.SLACK_WEBHOOK_URL) {
    throw new Error('SLACK_WEBHOOK_URL is not defined. Skipping...');
  }

  Logger.info('Preparing Slack payload');

  let projectName = await Project.getProjectName(Env.GITLAB_PROJECT_ID);

  request({
            method: 'POST',
            uri: Env.SLACK_WEBHOOK_URL,
            body: {
                text: `*${projectName} Version ${notes.tag_name}* was just released! :tada:\n\n ${notes.description}`
            },
            json: true
        }, (error, response) => {
          if (error) {
            throw new Error("An error occurred while sending Slack message. Slack Result: " + JSON.stringify(response));
          }

          if(response.statusCode != 200) {
            return Logger.error(`An error occurred while sending Slack message - ${response.statusCode}: ${response.body}`);
          }

          return Logger.info(`Slack message sent successfully`);
  });
};
