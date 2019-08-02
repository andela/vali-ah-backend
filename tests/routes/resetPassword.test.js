/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import sinonChai from 'sinon-chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';

import app from '../../src/index';
import { invalidUserId } from '../fixtures/users';

const baseRoute = '/api/v1';

chai.use(sinonChai);
chai.use(chaiHttp);

should();

describe('Reset and Update Password Endpoint', () => {
  let validToken;
  let validId;
  const tokens = {};

  const sampleUser = {
    firstName: 'firstname',
    lastName: 'lastname',
    userName: 'firstlast',
    email: 'kennyedward99@gmail.com',
    password: 'newpassword'
  };
  let secret;

  before(async () => {
    const sampleUserObject = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(sampleUser);
    secret = `${sampleUserObject.body.data.user.password}!${sampleUserObject.body.data.user.createdAt}`;
    tokens.validToken = jwt.sign({ id: sampleUserObject.body.data.user.id }, secret);
    tokens.invalidToken = jwt.sign({ id: sampleUserObject.body.data.user.id }, 'secret');
    validToken = sampleUserObject.body.data.token;
    validId = sampleUserObject.body.data.user.id;
  });

  it('should return 404 for non existing user - Reset Password', async () => {
    const { status } = await chai.request(app)
      .post(`${baseRoute}/auth/reset_password`)
      .send({ email: 'notfound@gmail.com' });

    status.should.eql(404);
  });

  it('should return 200 for existing user - Reset Password', async () => {
    const { status } = await chai.request(app)
      .post('/api/v1/auth/reset_password')
      .send({ email: sampleUser.email });

    status.should.eql(200);
  });

  it('should return 404 for non existing user - Update Password', async () => {
    const { status } = await chai.request(app)
      .patch(`${baseRoute}/auth/update_password/${invalidUserId}/${validToken}`)
      .send({ password: 'newpassword' });

    status.should.eql(404);
  });

  it('should return 400 if user is found, token is valid but new password is empty', async () => {
    const { status } = await chai.request(app)
      .patch(`${baseRoute}/auth/update_password/${validId}/${tokens.validToken}`)
      .send({ password: '' });

    status.should.eql(400);
  });

  it('should return success if user is found, password and token is valid', async () => {
    const { status } = await chai.request(app)
      .patch(`${baseRoute}/auth/update_password/${validId}/${tokens.validToken}`)
      .send({ password: 'newPassword' });

    status.should.eql(200);
  });
});
