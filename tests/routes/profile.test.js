import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import sinonchai from 'sinon-chai';

import Model from '../../src/models';
import app from '../../src';
import {
  profileData,
  profileId,
  usersignUpdetail,
  usersignUpdetail2,
  usersignUpdetail3,
  profiledataForLowerCase,
} from '../fixtures/users';
import { bulkCategories } from '../fixtures/subscriptions';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(sinonchai);

const { Users, Categories } = Model;
const profileUrl = '/api/v1/users/profile/';
const signUrl = '/api/v1/auth/signup';
const followUnfollowUrl = '/following/';
const getFollowersUrl = '/followers/';
const getFollowingsUrl = '/following/';
const fakeId = profileId;
let validToken;
let validTokenTwo;
let validTokenThree;
let responseToken;
let responseToken2;
let responseToken3;
let newUser;
let currentUserId;
let currentUserIdTwo;

describe('Profile', () => {
  before(async () => {
    await Users.destroy({ where: {} });
    await Categories.bulkCreate(bulkCategories, { returning: true });
    responseToken = await chai
      .request(app)
      .post(signUrl)
      .send(usersignUpdetail);

    responseToken2 = await chai
      .request(app)
      .post(signUrl)
      .send(usersignUpdetail2);

    responseToken3 = await chai
      .request(app)
      .post(signUrl)
      .send(usersignUpdetail3);
  });

  after(async () => {
    await Users.destroy({ where: {} });
    await Categories.destroy({ where: {} });
  });

  describe('PATCH /users/profile/', () => {
    it('should update user with valid input', async () => {
      newUser = await Users.create(profileData);
      validToken = responseToken.body.data.token;
      currentUserId = responseToken.body.data.user.id;
      validTokenTwo = responseToken2.body.data.token;
      currentUserIdTwo = responseToken2.body.data.user.id;
      validTokenThree = responseToken3.body.data.token;

      const response = await chai
        .request(app)
        .patch(`${profileUrl}${currentUserId}`)
        .set('authorization', `Bearer ${validToken}`)
        .send(profiledataForLowerCase);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
      response.body.status.should.eql('success');
      response.body.data.should.have.property('firstName');
      response.body.data.should.have.property('lastName');
      response.body.data.should.have.property('email');
    });

    it('should not update user when it value is invalid', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${currentUserId}`)
        .set('authorization', `Bearer ${validToken}`)
        .send({ email: 'NENNYgmail.com' });

      response.should.have.status(400);
      response.body.error.errors.should.have.property('email');
    });

    it('should not update user if user is not the current user', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${newUser.dataValues.id}`)
        .set('authorization', `Bearer ${validToken}`)
        .send({ lastName: 'nOMmy' });

      response.should.have.status(403);
      response.body.status.should.eql('error');
    });

    it('should not update a user if an empty body is provided', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${currentUserId}`)
        .set('authorization', `Bearer ${validToken}`)
        .send({});

      response.should.have.status(400);
      response.body.status.should.eql('error');
    });
  });

  describe('GET /users/profile/', () => {
    it('should get a user', async () => {
      const response = await chai
        .request(app)
        .get(`${profileUrl}${newUser.dataValues.id}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
    });

    it('should not get a user', async () => {
      const response = await chai
        .request(app)
        .get(`${profileUrl}${fakeId}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(404);
      response.body.status.should.eql('error');
    });
  });

  describe('PATCH users/profile/:userId/following', () => {
    it('should follow if a user exist', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${newUser.dataValues.id}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
      response.body.status.should.eql('success');
    });

    it('should follow if a user exists (user two)', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${newUser.dataValues.id}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validTokenTwo}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
      response.body.status.should.eql('success');
    });

    it('should follow if a user exists (user three)', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${currentUserIdTwo}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validTokenThree}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
      response.body.status.should.eql('success');
    });

    it('should not follow if a user wants to follow himself', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${currentUserId}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(409);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('User cannot perform this action');
    });

    it('should not follow if user does not exist', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${fakeId}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(404);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('User does not exist');
    });

    it('should not follow user if UUID is provided', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}kfjgk-939jg${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(400);
      response.body.error.errors.should.have.property('userId');
      response.body.error.message.should.eql('Validation error');
    });

    it('should unfollow if a user exist', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${newUser.dataValues.id}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
      response.body.status.should.eql('success');
    });

    it('should not unfollow if a user wants to unfollow its self', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${currentUserId}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(409);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('User cannot perform this action');
    });

    it('should not unfollow if user does not exist', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}${fakeId}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(404);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('User does not exist');
    });

    it('should not unfollow user if an invalid  UUID is provided', async () => {
      const response = await chai
        .request(app)
        .patch(`${profileUrl}kfjgk-939j908-099g${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(400);
      response.body.error.errors.should.have.property('userId');
      response.body.error.message.should.eql('Validation error');
    });
  });

  describe('GET users/profile/:userId/followers', () => {
    it('should get all followers if user exist', async () => {
      const response = await chai
        .request(app)
        .get(`${profileUrl}${currentUserIdTwo}${getFollowersUrl}`)
        .set('authorization', `Bearer ${validTokenTwo}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
      response.body.status.should.eql('success');
    });

    it('should not get all followers user if an invalid UUID is provided', async () => {
      const response = await chai
        .request(app)
        .get(`${profileUrl}kfjgk-939jkhjh-98g${getFollowersUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(400);
      response.body.error.errors.should.have.property('userId');
      response.body.error.message.should.eql('Validation error');
    });
  });

  describe('GET users/profile/:userId/following', () => {
    it('should get followings if a user exists', async () => {
      const response = await chai
        .request(app)
        .get(`${profileUrl}${currentUserIdTwo}${getFollowingsUrl}`)
        .set('authorization', `Bearer ${validTokenTwo}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
      response.body.status.should.eql('success');
    });

    it('should not get all following user if an invalid UUID is provided', async () => {
      const response = await chai
        .request(app)
        .get(`${profileUrl}kfjgk-939jkjhk-jkjhgg${getFollowingsUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(400);
      response.body.error.errors.should.have.property('userId');
      response.body.error.message.should.eql('Validation error');
    });

    it('should not get all following if id does not exist', async () => {
      const response = await chai
        .request(app)
        .get(`${profileUrl}${fakeId}${getFollowingsUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(404);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('User does not exist');
    });
  });

  describe('POST users/subscribe', () => {
    const url = '/api/v1/users/subscriptions';
    let token;

    it('should get throw error if no categories are supplied', async () => {
      ({ token } = responseToken.body.data);
      const response = await chai
        .request(app)
        .post(url)
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(400);
      response.body.status.should.eql('error');
      response.body.error.errors.categories.should.eql('Categories cannot be empty');
    });

    it('should get throw error if categories is not an array', async () => {
      const response = await chai
        .request(app)
        .post(url)
        .set('authorization', `Bearer ${token}`)
        .send({ categories: 'string' });

      response.should.have.status(400);
      response.body.status.should.eql('error');
      response.body.error.errors.categories.should.eql('Categories should be an array');
    });

    it('should throw error if categories array is empty', async () => {
      const response = await chai
        .request(app)
        .post(url)
        .set('authorization', `Bearer ${token}`)
        .send({ categories: [] });

      response.should.have.status(400);
      response.body.status.should.eql('error');
      response.body.error.errors.categories.should.eql('Categories array cannot be empty');
    });

    it('should throw error if an unsupported category is submitted', async () => {
      const response = await chai
        .request(app)
        .post(url)
        .set('authorization', `Bearer ${token}`)
        .send({ categories: ['eating', 'travel', 'motivation'] });

      response.should.have.status(400);
      response.body.status.should.eql('error');
      response.body.error.errors.categories.should.eql("Categories 'eating', 'travel' not supported");
    });

    it('should throw error if an unsupported category is submitted', async () => {
      const response = await chai
        .request(app)
        .post(url)
        .set('authorization', `Bearer ${token}`)
        .send({ categories: ['eating', 'motivation'] });

      response.should.have.status(400);
      response.body.status.should.eql('error');
      response.body.error.errors.categories.should.eql("Category 'eating' not supported");
    });

    it('should successfully subscribe to articles', async () => {
      const response = await chai
        .request(app)
        .post(url)
        .set('authorization', `Bearer ${token}`)
        .send({ categories: ['motivation'] });

      response.should.have.status(200);
      response.body.status.should.eql('success');
      response.body.message.should.eql('motivation subscribed to successfully');
    });

    it('should successfully subscribe to articles', async () => {
      const response = await chai
        .request(app)
        .post(url)
        .set('authorization', `Bearer ${token}`)
        .send({ categories: ['motivation', 'time management'] });

      response.should.have.status(200);
      response.body.status.should.eql('success');
      response.body.message.should.eql('motivation, time management subscribed to successfully');
    });
  });
});
