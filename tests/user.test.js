import chai, { should } from 'chai';
import chaiHttp from 'chai-http';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import app from '../src';

import { signup, signin } from '../src/controllers/userController';
import * as userService from '../src/services/userAuth';
import database from '../src/models/index';

import user from './mock';

chai.use(chaiHttp);
chai.use(sinonChai);
should();

const { Users } = database;

describe('signup Route', () => {
  it('should post to /api/v1/auth/signup', async () => {
    const response = await chai.request(app).post('/api/v1/auth/signup').send(user);
    response.should.have.status(200);
    response.body.status.should.eql('success');
    response.body.data.should.have.property('token');
    response.body.data.token.should.be.a('string');
    response.body.should.have.property('data');
    response.body.data.user.should.have.property('firstName');
    response.body.data.user.should.have.property('lastName');
    response.body.data.user.should.have.property('email');
  });

  it('should return an error if user is already registered', async () => {
    const response = await chai.request(app).post('/api/v1/auth/signup').send(user);

    response.should.have.status(409);
    response.body.status.should.eql('error');
    response.body.should.have.property('error');
  });
});

describe('signin Route', () => {
  after(async () => {
    await Users.destroy({
      where: {},
      truncate: true
    });
  });

  it('should throw an error for wrong password', async () => {
    const response = await chai.request(app).post('/api/v1/auth/signin').send({
      email: user.email,
      password: 'wrong password'
    });

    response.should.have.status(400);
    response.body.status.should.eql('error');
    response.body.error.message.should.equal('invalid user name or password');
  });

  it('should throw an error for wrong email', async () => {
    const response = await chai.request(app).post('/api/v1/auth/signin').send({
      email: 'wrongemail@gmail.com',
      password: user.password
    });

    response.should.have.status(400);
    response.body.status.should.eql('error');
    response.body.error.message.should.equal('you are not yet registered');
  });

  it('should post to /api/v1/auth/signin', async () => {
    const response = await chai.request(app).post('/api/v1/auth/signin').send({
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

  it('fakes server error when user signs up', async () => {
    const req = {};
    const res = {
      status() {},
      json() {}
    };

    const next = (err) => {
      res.status(500).json({ err });
    };

    sinon.stub(res, 'status').returnsThis();
    sinon.stub(userService, 'createUser').throws();

    await signup(req, res, next);
    (res.status).should.be.calledWith(500);

    userService.createUser.restore();
  });

  it('fakes server error when user signs in', async () => {
    const req = {
      body: { email: 'shit' }
    };
    const res = {
      status() {},
      json() {}
    };

    const next = (err) => {
      res.status(500).json({ err });
    };

    sinon.stub(res, 'status').returnsThis();
    sinon.stub(userService, 'checkinUser').throws();

    await signin(req, res, next);
    (res.status).should.be.calledWith(500);

    userService.checkinUser.restore();
  });
});
