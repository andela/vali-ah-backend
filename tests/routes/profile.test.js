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
  profiledataForLowerCase
} from '../fixtures/users';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(sinonchai);

const { Users } = Model;
const profileUrl = '/api/v1/users/profile/';
const signUrl = '/api/v1/auth/signup';
const followUnfollowUrl = '/following/';
const getFollowersUrl = '/followers/';
const getFollowingsUrl = '/followings/';
const fakeId = profileId;
let validToken;
let responseToken;
let newUser;
let currentUserId;

describe('Profile', () => {
  before(async () => {
    await Users.destroy({ cascade: true, where: {} });
    responseToken = await chai.request(app)
      .post(signUrl)
      .send(usersignUpdetail);
  });
  describe('Patch /users/profile/', () => {
    it('should update user with valid input', async () => {
      newUser = await Users.create(profileData);
      validToken = responseToken.body.data.token;
      currentUserId = responseToken.body.data.user.id;

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

      response.should.have.status(401);
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

  describe('Get /users/profile/', () => {
    it('should get a user', async () => {
      const response = await chai
        .request(app)
        .get(`${profileUrl}${newUser.dataValues.id}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
    });

    it('should not get a user', async () => {
      const response = await chai.request(app)
        .get(`${profileUrl}${fakeId}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(404);
      response.body.status.should.eql('error');
    });
  });

  describe('Patch users/profile/:userId/following', () => {
    it('should follow if a user exist', async () => {
      const response = await chai.request(app)
        .patch(`${profileUrl}${newUser.dataValues.id}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
      response.body.status.should.eql('success');
    });

    it('should not follow if a user wants to follow its self', async () => {
      const response = await chai.request(app)
        .patch(`${profileUrl}${currentUserId}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(409);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('User cannot perform this action');
    });

    it('should not follow if user does not exist', async () => {
      const response = await chai.request(app)
        .patch(`${profileUrl}${fakeId}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(404);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('User not found');
    });

    it('should not follow user if UUID is provided', async () => {
      const response = await chai.request(app)
        .patch(`${profileUrl}kfjgk-939jg${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(400);
      response.body.error.errors.should.have.property('userId');
      response.body.error.message.should.eql('Validation error');
    });

    it('should unfollow if a user exist', async () => {
      const response = await chai.request(app)
        .patch(`${profileUrl}${newUser.dataValues.id}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(200);
      response.body.should.have.a.property('data');
      response.body.status.should.eql('success');
    });

    it('should not unfollow if a user wants to unfollow its self', async () => {
      const response = await chai.request(app)
        .patch(`${profileUrl}${currentUserId}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(409);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('User cannot perform this action');
    });

    it('should not unfollow if user does not exist', async () => {
      const response = await chai.request(app)
        .patch(`${profileUrl}${fakeId}${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(404);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('User not found');
    });

    it('should not unfollow user if an invalid  UUID is provided', async () => {
      const response = await chai.request(app)
        .patch(`${profileUrl}kfjgk-939j908-099g${followUnfollowUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(400);
      response.body.error.errors.should.have.property('userId');
      response.body.error.message.should.eql('Validation error');
    });
  });

  describe('get users/profile/:userId/followers', () => {
    it('should get all followers if user exist', async () => {
      const response = await chai.request(app)
        .get(`${profileUrl}${newUser.dataValues.id}${getFollowersUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(200);
      response.body.should.have.a.property('allFollowers');
      response.body.status.should.eql('success');
    });

    it('should not get all followers user if an invalid UUID is provided', async () => {
      const response = await chai.request(app)
        .get(`${profileUrl}kfjgk-939jkhjh-98g${getFollowersUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(400);
      response.body.error.errors.should.have.property('userId');
      response.body.error.message.should.eql('Validation error');
    });
  });

  describe('get users/profile/:userId/followings', () => {
    it('should get followings if a user exist', async () => {
      const response = await chai.request(app)
        .get(`${profileUrl}${newUser.dataValues.id}${getFollowingsUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(200);
      response.body.should.have.a.property('allFollowings');
      response.body.status.should.eql('success');
    });

    it('should not get all following user if an invalid UUID is provided', async () => {
      const response = await chai.request(app)
        .get(`${profileUrl}kfjgk-939jkjhk-jkjhgg${getFollowingsUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(400);
      response.body.error.errors.should.have.property('userId');
      response.body.error.message.should.eql('Validation error');
    });

    it('should not get all following if id does not exist', async () => {
      const response = await chai.request(app)
        .get(`${profileUrl}${fakeId}${getFollowingsUrl}`)
        .set('authorization', `Bearer ${validToken}`);

      response.should.have.status(404);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('Resource not found');
    });
  });
});
