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
    const invalidToken = { accessToken: 'Invalid access token' };
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
      sampleToken = { accessToken: 'Invalid access token' };
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
        .send({ accessToken: 'Invalid access token' });

      googleStub.should.calledOnce;
      response.should.have.status(200);
      response.body.status.should.eql('success');
      response.body.data.user.should.be.a('object');
    });
  });

  describe('Twitter callback function', () => {
    const profile = userProfileDetails;
    const done = (err, next) => next;

    it('should perform call back function successfully', async () => {
      const response = performCallback(null, null, profile, done);
      response.should.be.a('object');
      response.userName.should.be.eql(profile.username);
    });
  });

  describe('Twitter social login', () => {
    let request;
    let response;
    const mockedResponse = {};

    beforeEach(() => {
      request = { user: extractedUserDetails };
      response = {
        status(code) {
          mockedResponse.status = code;
          return this;
        },
        json(body) {
          mockedResponse.body = body;
          return {};
        }
      };
    });

    it('should signup successfully', async () => {
      await twitterLogin(request, response);

      mockedResponse.status.should.eql(201);
      mockedResponse.body.data.user.should.be.a('object');
    });

    it('should login successfully', async () => {
      await twitterLogin(request, response);

      mockedResponse.status.should.eql(200);
      mockedResponse.body.data.user.should.be.a('object');
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
