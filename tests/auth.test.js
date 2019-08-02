import chai, { should } from 'chai';
import chaiHttp from 'chai-http';

import app from '../src';

import {
  undefinedFirstName,
  invalidFirstName,
  shortLastName,
  invalidLastName,
  shortUsername,
  invalidEmail,
  shortPassword,
  invalidPassword
} from './fixtures/users';

chai.use(chaiHttp);
should();

const signupRoute = '/api/v1/auth/signup';

describe(`Signup ${signupRoute}`, () => {
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

  it('should return error when username is invalid', async () => {
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

  it('hould return error message when password does not contain alphanumeric characters', async () => {
    const response = await chai.request(app).post(signupRoute).send(invalidPassword);

    response.should.have.status(400);
    response.body.error.errors.password.should.eql('Password must be alphanumeric characters');
  });
});
