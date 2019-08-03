import EventEmitter from 'events';

import emailService from './email';

/**
 * Class used for all email related notifications
 *
 * @class
 *
 * @extends EventEmitter
 * @exports Notification – A notification instance to ensure singleton pattern
 * @description handles all notification related activites. supported activity type are
 * - accountActivation
 * - articleVoted
 * - articleSuspended
 * - articleCommented
 * - passwordRecovery
 * - following
 */
class Notification extends EventEmitter {
  /**
   * Create a Notification.
   * @description initialises the event
   */
  constructor() {
    super();
    this.on('notification', this.handleNotification);
  }

  /**
   * Initialises the event
   *
   * @param {Object} eventPayload - The event payload. Contains notification type and payload.
   *
   * @return {void}
   */
  handleNotification({ type, payload }) {
    if (type in this) return this[type](payload);
  }

  /**
   * Handles notification for account activation
   *
   * @param {Object} payload - An Object that contains necessary info to send the notification
   *
   * @return {Object} - status of event executed
   */
  accountActivation(payload) {
    return this.sendMail('accountActivation', payload);
  }

  /**
   * Handles notification for account activation
   *
   * @param {String} type - type of mail being sent.
   * @param {Array} payload - message data.
   *
   * @return {Object} - status of event executed
   */
  async sendMail(type, payload) {
    await emailService({ type, payload });
    this.emit('notificationSent', { type, payload });

    return { status: 'sent' };
  }
}

export default new Notification();
