import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sendgrid from '@sendgrid/mail';

import app from '../../src';
import database from '../../src/models';
import {
  undefinedFirstName,
  invalidFirstName,
  shortLastName,
  invalidLastName,
  shortUsername,
  invalidEmail,
  shortPassword,
  user,
  anotherUser,
  sameUserName
} from '../fixtures/users';

chai.use(chaiHttp);
should();

const { Users } = database;
const signupRoute = '/api/v1/auth/signup';
const signoutRoute = '/api/v1/auth/signout';

let validToken;
let blacklistedToken;

const server = () => chai.request(app);

before(() => {
  sinon.stub(sendgrid, 'send').resolves();
});

after(() => {
  if (sendgrid.send.restore) sendgrid.send.restore();
});

describe('Auth Routes', () => {
  describe('Signup Route', () => {
    it('should post to /api/v1/auth/signup', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      response.should.have.status(201);
      response.body.status.should.eql('success');
      response.body.data.should.have.property('token');
      response.body.data.token.should.be.a('string');
      response.body.should.have.property('data');
      response.body.data.user.should.have.property('firstName');
      response.body.data.user.should.have.property('lastName');
      response.body.data.user.should.have.property('email');
    });

    it('should throw an error if userName is already in use', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(sameUserName);

      response.should.have.status(409);
      response.body.error.message.should.equal('UserName already in use');
      response.body.status.should.eql('error');
      response.body.should.have.property('error');
    });

    it('should return an error if user is already registered', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      response.should.have.status(409);
      response.body.status.should.eql('error');
      response.body.should.have.property('error');
    });
  });

  describe('Signin Route', () => {
    after(async () => {
      await Users.destroy({
        where: {},
        truncate: true
      });
    });

    it('should post to /api/v1/auth/signin', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: user.email,
          password: user.password
        });

      response.should.have.status(200);
      response.body.status.should.eql('success');
      response.body.data.should.have.property('token');
      response.body.data.token.should.be.a('string');
      response.body.should.have.property('data');
      response.body.data.user.should.have.property('firstName');
      response.body.data.user.should.have.property('lastName');
      response.body.data.user.should.have.property('email');
    });

    it('should throw an error for wrong password', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: user.email,
          password: 'wrong password'
        });

      response.should.have.status(400);
      response.body.status.should.eql('error');
      response.body.error.message.should.equal('Invalid user name or password');
    });

    it('should throw an error for wrong email', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'wrongemail@gmail.com',
          password: user.password
        });

      response.should.have.status(404);
      response.body.status.should.eql('error');
      response.body.error.message.should.equal('You are not yet registered');
    });
  });

  describe(`Signup ${signupRoute} - Validation`, () => {
    it('should return error when first name is undefined', async () => {
      const response = await chai.request(app).post(signupRoute).send(undefinedFirstName);

      response.should.have.status(400);
      response.body.error.errors.firstName.should.eql('First name should be between 2 to 15 characters');
    });

    it('should return error when first name contains invlaid character', async () => {
      const response = await chai.request(app).post(signupRoute).send(invalidFirstName);

      response.should.have.status(400);
      response.body.error.errors.firstName.should.eql('First name should only contain alphabets');
    });

    it('should return error when last name is not between 2 to 15 characters', async () => {
      const response = await chai.request(app).post(signupRoute).send(shortLastName);

      response.should.have.status(400);
      response.body.error.errors.lastName.should.eql('Last name should be between 2 to 15 characters');
    });

    it('should return error when last name contains invlaid character', async () => {
      const response = await chai.request(app).post(signupRoute).send(invalidLastName);

      response.should.have.status(400);
      response.body.error.errors.lastName.should.eql('Last name should only contain alphabets');
    });

    it('should return error when userName is invalid', async () => {
      const response = await chai.request(app).post(signupRoute).send(shortUsername);

      response.should.have.status(400);
      response.body.error.errors.userName.should.eql('Username should be between 2 to 20 characters');
    });

    it('should return error when email is invalid', async () => {
      const response = await chai.request(app).post(signupRoute).send(invalidEmail);

      response.should.have.status(400);
      response.body.error.errors.email.should.eql('Enter a valid email address');
    });

    it('should return error when password is short', async () => {
      const response = await chai.request(app).post(signupRoute).send(shortPassword);

      response.should.have.status(400);
      response.body.error.errors.password.should.eql('Password should be between 8 to 15 characters');
    });
  });
});

describe('Signout Route', () => {
  before(async () => {
    const { body: { data } } = await server()
      .post(signupRoute)
      .send(anotherUser);
    validToken = data.token;
  });

  it('should log out a user', async () => {
    const response = await server()
      .post(`${signoutRoute}`)
      .set('Authorization', `Bearer ${validToken}`);

    response.should.have.status(200);
    response.body.status.should.eql('success');
    response.body.should.be.a('object');
  });

  it('should not let a user with an invalid token make a request', async () => {
    const response = await server()
      .post(`${signoutRoute}`)
      .set('Authorization', 'bad token');

    response.should.have.status(401);
    response.body.should.be.a('object');
    response.body.status.should.eql('error');
    response.body.should.have.property('error');
    response.body.error.should.be.a('object');
    response.body.error.should.have.property('message');
    response.body.error.should.have.property('trace');
    response.body.error.message.should.eql('jwt malformed');
  });

  it('should not let a user make a request if the header is not set', async () => {
    const response = await server()
      .post(`${signoutRoute}`);

    response.should.have.status(412);
    response.body.should.be.a('object');
    response.body.status.should.eql('error');
    response.body.should.have.property('error');
    response.body.error.should.be.a('object');
    response.body.error.should.have.property('message');
    response.body.error.should.have.property('trace');
    response.body.error.message.should.eql('Authorization header not set');
  });

  it('should not let a logged out user make a request', async () => {
    blacklistedToken = validToken;
    const response = await server()
      .post(`${signoutRoute}`)
      .set('Authorization', `Bearer ${blacklistedToken}`);

    response.should.have.status(403);
    response.body.should.be.a('object');
    response.body.status.should.eql('error');
    response.body.should.have.property('error');
    response.body.error.should.be.a('object');
    response.body.error.should.have.property('message');
    response.body.error.should.have.property('trace');
    response.body.error.message.should.eql('Please login or signup to access this resource');
  });

  it('should throw 400 status code accessing the signout route without a token', async () => {
    const response = await server()
      .post(`${signoutRoute}`)
      .set('Authorization', '');

    response.should.have.status(400);
    response.body.should.be.a('object');
    response.body.status.should.eql('error');
    response.body.should.have.property('error');
    response.body.error.should.be.a('object');
    response.body.error.should.have.property('message');
    response.body.error.should.have.property('trace');
    response.body.error.message.should.eql('No token provided. Please signup or login');
  });
});
