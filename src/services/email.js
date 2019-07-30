import { config } from 'dotenv';
import sendgrid from '@sendgrid/mail';
import Debug from 'debug';

config();

const debug = Debug('dev');
const { SENDGRID_API_KEY, SENDGRID_EMAIL, SENDGRID_ACTIVATION_TEMPLATE } = process.env;
const templates = { accountActivation: SENDGRID_ACTIVATION_TEMPLATE };

/**
 * Initialises the event
 *
 * @function
 *
 * @param {String} type - the type of message which corresponds to the mail template
 * @param {Array} data - can be a list for bulk sending. must contain email parameter
 *
 * @return {promise} - Returns a promise that get resolcved to a success object
 */
export default async ({ type, payload }) => {
  try {
    sendgrid.setApiKey(SENDGRID_API_KEY);

    const template = templates[type];

    if (!template) throw new Error('Email Template not available');

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
