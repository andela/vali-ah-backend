import Debug from 'debug';

import Models from '../models';
import notification from '../services/notification';

const { Sessions } = Models;
const debug = Debug('dev');

/**
 * handles in app notification event
 *
 * @function
 *
 * @param {Object} io - socket io instance
 *
 * @return {Function} - notification handler
 */
export const notificationHandler = io => ({ payload: notificationData = [] }) => notificationData
  .map(({ payload }) => {
    io.to(payload.sessionId).emit('notification', payload);
    return payload;
  });

/**
 * returns handler for socket.io on connection event
 *
 * @function
 *
 * @param {Object} io - socket io instance
 *
 * @return {Function} - connection handler
 */
export const onConnection = (io) => {
  const inAppNotificationHandler = notificationHandler(io);
  notification.on('inAppNotification', inAppNotificationHandler);

  return async (socket) => {
    const { _query: { userId } } = socket.request;
    const sessionId = socket.id;
    debug(`client ${sessionId} connected`);

    await Sessions.saveSession({ userId, sessionId });

    return sessionId;
  };
};
