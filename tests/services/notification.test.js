/* eslint-disable no-unused-expressions */
import { should as importedShould } from 'chai';
import sinon from 'sinon';
import faker from 'faker';
import sendgrid from '@sendgrid/mail';

import notification from '../../src/services/notification';
import Models from '../../src/models';
import { users, usersWithFollowing } from '../fixtures/users';
import { articles } from '../fixtures/articles';

const { Users, Followers, Articles } = Models;

const should = importedShould();

describe('Notification System', () => {
  before(async () => {
    sinon.stub(sendgrid, 'send').resolves();
    articles[0].authorId = usersWithFollowing[0].followeeId;
    await Articles.destroy({ where: {} });
    await Users.bulkCreate(users);
    await Followers.bulkCreate(usersWithFollowing);
    await Articles.bulkCreate(articles);
  });

  after(async () => {
    if (sendgrid.send.restore) sendgrid.send.restore();
    await Articles.destroy({ where: {} });
  });

  describe('Notifications', () => {
    it('should return undefined for unsupported types', () => {
      const payload = { type: 'unsupported', email: 'demo@demo.com', userId: 'id' };
      const data = notification.handleNotification(payload);

      should.equal(data, undefined);
    });

    it('should handle notification based on type', () => {
      const payload = { type: 'accountActivation', payload: { email: 'demo@demo.com', userId: 'id' } };
      const data = notification.handleNotification(payload);

      should.not.equal(data, undefined);
    });

    it('should add custom notification type with handler if not existent', () => {
      const notify = notification.addNotification('testFollowing', sinon.spy());

      notify.should.be.eql(notification);
    });

    it('should return notification instance with existent notification type', () => {
      const notify = notification.addNotification('testFollowing', sinon.spy());

      notify.should.be.eql(notification);
    });

    it('should handle notification based on type', () => {
      const handler = sinon.spy();
      const notificationType = 'userFollowing';
      const notificationPayload = { email: 'demo@demo.com', userId: 'id' };
      const payload = { type: notificationType, payload: notificationPayload };

      notification.addNotification(notificationType, handler);
      notification.handleNotification(payload);

      handler.should.be.calledOnce;
      handler.should.be.calledWith(notificationPayload);
    });
  });

  describe('User Following', () => {
    it('should return scheduled notification data', async () => {
      const { id: userId } = users[0];
      const following = await notification.following({ userId, followerId: faker.random.uuid() });

      following[0].userId.should.be.equal(userId);
    });
  });

  describe('New Publication', () => {
    it('should return notification data saved', async () => {
      const { authorId, id: articleId } = articles[0];
      const notificationData = await notification
        .newPublication({ authorId, articleId });

      notificationData.should.be.eql(true);
    }).timeout(20000);
  });

  describe('New comment on article', () => {
    it('should return notification data saved', async () => {
      const { authorId: userId, id: articleId } = articles[0];
      const notificationData = await notification.articleCommentedOn({ articleId, userId });

      notificationData.should.be.an('array');
      notificationData[0].payload.should.not.be.empty;
    });
  });

  describe('Article voted', () => {
    it('should return notification data saved', async () => {
      const { authorId: userId, id: articleId } = articles[0];
      const notificationData = await notification.articleVoted({ articleId, userId, upvote: true });

      notificationData.should.be.an('array');
      notificationData[0].payload.should.not.be.empty;
    });
  });

  describe('Article suspended', () => {
    it('should return notification data saved', async () => {
      const notificationData = await notification.articleSuspended({ articleId: articles[0].id });

      notificationData.should.be.an('array');
    });
  });

  describe('send batch', () => {
    it('should return notification data saved', async () => {
      const notificationData = await notification.sendBatch();

      notificationData.should.be.an('array');
    });
  });
});

describe('Password recovery Notification', () => {
  it('should handle notification for password recovery', () => {
    const payload = { type: 'passwordRecovery', payload: { email: 'demo@demo.com', userId: 'id' } };
    const data = notification.handleNotification(payload);
    should.not.equal(data, undefined);
  });
});
