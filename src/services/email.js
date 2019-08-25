import { config } from 'dotenv';
import sendgrid from '@sendgrid/mail';
import Debug from 'debug';

config();

const debug = Debug('dev');

const {
  SENDGRID_API_KEY,
  SENDGRID_EMAIL,
  SENDGRID_PASSWORD_RECOVERY_TEMPLATE,
  SENDGRID_PASSWORD_UPDATE_SUCCESSFUL_TEMPLATE
} = process.env;

const templates = {
  accountActivation: process.env.SENDGRID_ACTIVATION_TEMPLATE,
  activityNotification: process.env.SENDGRID_ACTIVITY_TEMPLATE,
  passwordRecovery: SENDGRID_PASSWORD_RECOVERY_TEMPLATE,
  passwordUpdateSuccessful: SENDGRID_PASSWORD_UPDATE_SUCCESSFUL_TEMPLATE
};

/**
 * Initialises the event
 *
 * @function
 *
 * @param {string} type - the type of message which corresponds to the mail template
 * @param {Array} payload - can be a list for bulk sending. must contain email parameter
 * @param {string} template - sendgrid template to use
 *
 * @returns {Promise} - Returns a promise that get resolved to a success object
 */
export default async ({ type, payload, template }) => {
  try {
    sendgrid.setApiKey(SENDGRID_API_KEY);

    template = template || templates[type];

    if (!template) throw new Error('Email template not available');

    if (!Array.isArray(payload)) throw new Error('Mail data should be an array');

    const messagePayload = payload.map((singleEmailData) => {
      const { email } = singleEmailData;

      return {
        to: email,
        from: SENDGRID_EMAIL,
        templateId: template,
        dynamic_template_data: {
          ...singleEmailData
        }
      };
    });

    await sendgrid.send(messagePayload);
  } catch (error) {
    debug(error);
    return error;
  }

  return { message: 'Email sent' };
};
