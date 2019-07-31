/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { OAuth2Client } from 'google-auth-library';

import db from '../../src/models';
import app from '../../src';
import { performCallback, createOrFindUser } from '../../src/services/auth';
import authController from '../../src/controllers/auth';
import {
  facebookFirstCallResponse,
  facebookSecondCallErrorResponse,
  facebookSecondCallInvalidToken,
  facebookSecondCallSuccessResponse,
  facebookThirdCallSuccessResponse,
  googleSuccessResponse,
  userProfileDetails,
  extractedUserDetails
} from '../fixtures/auth';

chai.use(chaiHttp);
chai.use(sinonChai);
should();

const { twitterLogin } = authController;

before(async () => {
  try {
    await db.sync({ force: true });
  } catch (error) {
    return error;
  }
});

describe('Social Login Route', () => {
  it('should throw error social provider is invalid', async () => {
    const response = await chai.request(app).post('/api/v1/auth/something');

    response.should.have.status(400);
    response.body.status.should.eql('error');
  });

  it('should throw error if access token is invalid', async () => {
    const invalidToken = { accessToken: 'invalid access token' };
    const response = await chai
      .request(app)
      .post('/api/v1/auth/google')
      .send(invalidToken);

    response.should.have.status(500);
    response.body.status.should.eql('error');
  });

  describe('Facebook Authentication method', () => {
    let facebook;
    let sampleToken;

    beforeEach(() => {
      facebook = sinon.stub(axios, 'get');
      facebook.onFirstCall().returns({ data: facebookFirstCallResponse });
      sampleToken = { accessToken: 'invalid access token' };
    });

    afterEach(() => {
      axios.get.restore();
    });

    it('should throw error if access token is invalid', async () => {
      facebook.onSecondCall().returns({
        data: { data: facebookSecondCallErrorResponse }
      });

      const response = await chai
        .request(app)
        .post('/api/v1/auth/facebook')
        .send(sampleToken);

      facebook.should.calledTwice;
      response.should.have.status(500);
      response.body.status.should.eql('error');
    });

    it('should throw error if facebook access token is invalid', async () => {
      facebook.onSecondCall().returns({
        data: { data: facebookSecondCallInvalidToken }
      });

      const response = await chai
        .request(app)
        .post('/api/v1/auth/facebook')
        .send(sampleToken);

      facebook.should.calledTwice;
      response.should.have.status(500);
      response.body.status.should.eql('error');
    });

    it('should create a new user', async () => {
      facebook.onSecondCall().returns({
        data: { data: facebookSecondCallSuccessResponse }
      });

      facebook.onThirdCall().returns({ data: facebookThirdCallSuccessResponse });

      const response = await chai
        .request(app)
        .post('/api/v1/auth/facebook')
        .send(sampleToken);

      facebook.should.calledThrice;
      response.should.have.status(201);
      response.body.status.should.eql('success');
      response.body.data.user.should.be.a('object');
    });
  });

  describe('Google Authentication Method', () => {
    let googleStub;

    beforeEach(() => {
      googleStub = sinon.stub(OAuth2Client.prototype, 'verifyIdToken').returns({
        getPayload: () => googleSuccessResponse
      });
    });

    afterEach(() => {
      OAuth2Client.prototype.verifyIdToken.restore();
    });

    it('should create a new user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/google')
        .send({ accessToken: 'invalid access token' });

      googleStub.should.calledOnce;
      response.should.have.status(200);
      response.body.status.should.eql('success');
      response.body.data.user.should.be.a('object');
    });
  });

  describe('Twitter Call Back function', () => {
    const profile = userProfileDetails;
    const done = (err, next) => next;

    it('should perform call back function successfully', async () => {
      const response = performCallback(null, null, profile, done);
      response.should.be.a('object');
      response.userName.should.be.eql(profile.username);
    });
  });

  describe('Twitter Social login', () => {
    let request;

    beforeEach(() => {
      request = { user: extractedUserDetails };
    });

    it('should signup successfully', async () => {
      const response = await twitterLogin(request);

      response.status.should.eql(201);
      response.data.user.should.be.a('object');
    });

    it('should login successfully', async () => {
      const response = await twitterLogin(request);

      response.status.should.eql(200);
      response.data.user.should.be.a('object');
    });

    it('should return error', async () => {
      let next = 0;
      try {
        await createOrFindUser({});
      } catch (error) {
        if (error) {
          next += 1;
        }
      }

      next.should.eql(1);
    });
  });
});
