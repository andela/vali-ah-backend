import EventEmitter from 'events';

import emailService from './email';
import Models from '../models';
import { queryPagination, batchQuery } from '../helpers/models';

const { Notifications, Users, Articles } = Models;

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
 * - articleCommentedOn
 * - passwordRecovery
 * - following
 * - newPublication
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
   * @function
   *
   * @param {Object} eventPayload - The event payload. Contains notification type and payload.
   * @param {string} eventPayload.type - type of event.
   * @param {Object} eventPayload.payload - The event payload
   *
   * @return {void}
   */
  handleNotification({ type, payload }) {
    if (type in this) return this[type](payload);
  }

  /**
   * Initialises the event
   *
   * @function
   *
   * @param {string} type - the type of notification
   * @param {Function} notificationHandler - function that handles defined notification
   *
   * @return {Notification} -instance of notification
   */
  addNotification(type, notificationHandler) {
    if (!(type in this)) this[type] = notificationHandler.bind(this);

    return this;
  }

  /**
   * Handles notification for account activation
   *
   * @function
   *
   * @param {Object} payload - An Object that contains necessary info to send the notification
   *
   * @return {Object} - status of event executed
   */
  accountActivation(payload) {
    return this.sendMail('accountActivation', payload);
  }

  /**
   * Handles notification when a user is been followed
   *
   * @function
   *
   * @param {Object} eventDetails - Details of the event
   * @param {string} eventDetails.userId - id of user been followed
   * @param {Object} eventDetails.followerId - id of user following the user
   *
   * @return {Object} - sequelize object for inserted data
   */
  async following({ userId, followerId }) {
    const { email, firstName, session } = await Users.getSingleUser(userId);

    const { sessionId } = session || {};
    const event = 'following';
    const payload = {
      followerId, email, event, firstName, sessionId
    };

    return this.scheduleNotification(event, [{
      userId, event, payload, email
    }]);
  }

  /**
   * Handles notification to an author's followers about new publication
   *
   * @function
   *
   * @param {Object} eventDetails - Details of the event
   * @param {string} eventDetails.authorId - id of author publishing article
   * @param {Object} eventDetails.articleId - id of article published
   *
   * @return {Object} - sequelize object for inserted data
   */
  async newPublication({ authorId, articleId }) {
    const { title, authors: { firstName, session } } = await Articles.getSingleArticle(articleId);

    const { sessionId } = session || {};
    const event = 'newPublication';

    const followers = await queryPagination(Users.getUserFollowers, { user: authorId });

    const schedule = (followersData) => {
      const notificationData = followersData.map(({ followers: { id: userId, email } }) => ({
        event,
        userId,
        email,
        payload: {
          event, email, articleId, firstName, title, sessionId
        }
      }));

      return this.scheduleNotification(event, notificationData);
    };

    await batchQuery(followers, schedule.bind(this));

    return true;
  }

  /**
   * Handles notification when an article is been commented by sending notification to author
   *
   * @function
   *
   * @param {Object} eventDetails - Details of the event
   * @param {string} eventDetails.userId - id of user making a comment
   * @param {Object} eventDetails.articleId - id of article
   *
   * @return {Object} - sequelize object for inserted data
   */
  async articleCommentedOn({ articleId, userId }) {
    const userName = await Users.getUserName(userId);
    const {
      title, authorId, authors: { email, session }
    } = await Articles.getSingleArticle(articleId);

    const { sessionId } = session || {};
    const event = 'articleCommentedOn';

    const payload = {
      event, title, commentedBy: userName, email, sessionId
    };

    return this.scheduleNotification(event, [{
      userId: authorId, event, payload, email
    }]);
  }

  /**
   * Handles notification when an article is upvoted
   *
   * @function
   *
   * @param {Object} eventDetails - Details of the event
   * @param {string} eventDetails.authorId - id of author publishing article
   * @param {Object} eventDetails.articleId - id of article published
   *
   * @return {Object} - sequelize object for inserted data
   */
  async articleVoted({ articleId, userId, upVote }) {
    const userName = await Users.getUserName(userId);
    const { title, authorId, authors: { email, session } } = await Articles
      .getSingleArticle(articleId);

    const { sessionId } = session || {};
    const event = 'articleVoted';

    const payload = {
      event, title, votedBy: userName, upVote, email, sessionId
    };

    return this.scheduleNotification(event, [{
      userId: authorId, event, payload, email
    }]);
  }

  /**
   * Handles notification when an article is upvoted
   *
   * @function
   *
   * @param {Object} eventDetails - Details of the event
   * @param {Object} eventDetails.articleId - id of article published
   *
   * @return {Object} - sequelize object for inserted data
   */
  async articleSuspended({ articleId }) {
    const { title, authorId, authors: { email, session } } = await Articles
      .getSingleArticle(articleId);

    const { sessionId } = session || {};
    const event = 'articleSuspended';
    const payload = {
      event, title, email, sessionId
    };

    return this.scheduleNotification(event, [{
      userId: authorId, event, payload, email
    }]);
  }

  /**
   * Handles notification when a user is been followed
   *
   * @function
   *
   * @param {string} event
   * @param {Array} notificationData
   *
   * @return {Object} - sequelize object for inserted data
   */
  async scheduleNotification(event, notificationData) {
    const notificationObject = await Notifications
      .bulkCreate(notificationData, { returning: true });

    this.emit('notificationBatched', { type: event, payload: notificationObject });
    this.emit('inAppNotification', { type: event, payload: notificationData });

    return notificationObject;
  }

  /**
   * Sends batched notification
   *
   * @function
   *
   * @return {Object} - sequelize object for inserted data
   */
  async sendBatch() {
    const notificationPagination = await queryPagination(Notifications.getBatchedNotifications);

    const batch = async (notificationsObject) => {
      const emailData = Notification.buildNotificationEmailData(notificationsObject);

      await this.sendMail('activityNotification', emailData);

      this.emit('notificationBatched', { type: 'event', payload: notificationsObject });
    };

    batchQuery(notificationPagination, batch.bind(this));

    return notificationPagination.data();
  }

  /**
   * Handles notification when a user is been followed
   *
   * @static
   *
   * @param {Array} notificationData
   *
   * @return {Object} - sequelize object for inserted data
   */
  static buildNotificationEmailData(notificationData) {
    const emailData = notificationData.reduce((acc, notifications) => {
      const {
        userId, email, event, payload
      } = notifications;

      if (!acc[userId]) acc[userId] = {};
      if (!acc[userId].email) acc[userId].email = email;

      acc[userId][event] = [...(acc[userId][event] || []), payload];
      notifications.update({ notified: true });

      return acc;
    }, {});

    return Object.values(emailData);
  }

  /**
   * Handles notification for account activation
   *
   * @function
   *
   * @param {String} type - type of mail being sent.
   * @param {Array} payload - message data.
   * @param {string} template -email template to use.
   *
   * @return {Object} - status of event executed
   */
  async sendMail(type, payload, template) {
    await emailService({ type, payload, template });
    this.emit('notificationSent', { type, payload });

    return { status: 'sent' };
  }
}

export default new Notification();
