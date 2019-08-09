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
const fakeId = profileId;
let validToken;
let responseToken;
let newUser;
let currentUserId;

describe('Profile', () => {
  before(async () => {
    await Users.destroy({ cascade: true, truncate: true });
    responseToken = await chai.request(app)
      .post(signUrl)
      .send(usersignUpdetail);
  });

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
  });

  it('should not update user when it value is invalid', async () => {
    const response = await chai
      .request(app)
      .patch(`${profileUrl}${currentUserId}`)
      .set('authorization', `Bearer ${validToken}`)
      .send({ email: 'NENNYgmail.com' });
    response.should.have.status(400);
  });

  it('should not update user if user id is wrong', async () => {
    const response = await chai
      .request(app)
      .patch(`${profileUrl}${newUser.dataValues.id}`)
      .set('authorization', `Bearer ${validToken}`)
      .send({ lastName: 'nOMmy' });
    response.should.have.status(401);
  });

  it('should not update user if user is not updating their account', async () => {
    const response = await chai
      .request(app)
      .patch(`${profileUrl}${newUser.dataValues.id}`)
      .set('authorization', `Bearer ${validToken}`)
      .send({ lastName: 'nOMmy' });
    response.should.have.status(401);
  });

  it('Should not update a user if an empty body is provided', async () => {
    const response = await chai
      .request(app)
      .patch(`${profileUrl}${currentUserId}`)
      .set('authorization', `Bearer ${validToken}`)
      .send({});
    response.should.have.status(400);
  });

  it('should get a user', async () => {
    const response = await chai
      .request(app)
      .get(`${profileUrl}${newUser.dataValues.id}`)
      .set('authorization', `Bearer ${validToken}`);
    response.should.have.status(200);
  });

  it('should not get a user', async () => {
    const response = await chai.request(app)
      .get(`${profileUrl}${fakeId}`)
      .set('authorization', `Bearer ${validToken}`);
    response.should.have.status(404);
  });
});
