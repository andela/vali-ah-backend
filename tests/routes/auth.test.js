import chai, { should } from 'chai';
import chaiHttp from 'chai-http';

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
  user
} from '../fixtures/users';

chai.use(chaiHttp);
should();

const { Users } = database;
const signupRoute = '/api/v1/auth/signup';

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
      response.body.error.message.should.equal('invalid user name or password');
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
      response.body.error.message.should.equal('you are not yet registered');
    });
  });

  describe(`Signup ${signupRoute} - Validation`, () => {
    it('should return error when first name is undefined', async () => {
      const response = await chai.request(app).post(signupRoute).send(undefinedFirstName);

      response.should.have.status(400);
      response.body.error.errors.firstName.should.eql('first name should be between 2 to 15 characters');
    });

    it('should return error when first name contains invlaid character', async () => {
      const response = await chai.request(app).post(signupRoute).send(invalidFirstName);

      response.should.have.status(400);
      response.body.error.errors.firstName.should.eql('first name should only contain alphabets');
    });

    it('should return error when last name is not between 2 to 15 characters', async () => {
      const response = await chai.request(app).post(signupRoute).send(shortLastName);

      response.should.have.status(400);
      response.body.error.errors.lastName.should.eql('last name should be between 2 to 15 characters');
    });

    it('should return error when last name contains invlaid character', async () => {
      const response = await chai.request(app).post(signupRoute).send(invalidLastName);

      response.should.have.status(400);
      response.body.error.errors.lastName.should.eql('last name should only contain alphabets');
    });

    it('should return error when userName is invalid', async () => {
      const response = await chai.request(app).post(signupRoute).send(shortUsername);

      response.should.have.status(400);
      response.body.error.errors.userName.should.eql('username should be between 2 to 20 characters');
    });

    it('should return error when email is invalid', async () => {
      const response = await chai.request(app).post(signupRoute).send(invalidEmail);

      response.should.have.status(400);
      response.body.error.errors.email.should.eql('enter a valid email address');
    });

    it('should return error when password is short', async () => {
      const response = await chai.request(app).post(signupRoute).send(shortPassword);

      response.should.have.status(400);
      response.body.error.errors.password.should.eql('password should be between 8 to 15 characters');
    });
  });
});
