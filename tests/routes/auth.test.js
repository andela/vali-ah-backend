import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import app from '../../src';
import auth, { signin, signup } from '../../src/controllers/auth';
import database from '../../src/models';
import { user } from '../fixtures/users';

chai.use(chaiHttp);
chai.use(sinonChai);
should();

const { Users } = database;

describe('Auth Routes', () => {
  describe('Signup Route', () => {
    it('should post to /api/v1/auth/signup', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(user);

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

    it('should return server error when there is a server issue during signup', async () => {
      const req = {};
      const res = {
        status() {},
        json() {}
      };

      const next = (err) => {
        res.status(500).json({ err });
      };

      const stub = sinon.stub(auth, 'signup').throws();
      sinon.stub(res, 'status').returnsThis();

      await signup(req, res, next);

      (res.status).should.be.calledWith(500);

      stub.restore();
    });

    it('should return server error when there is a server issue during sign in', async () => {
      const req = {};
      const res = {
        status() {},
        json() {}
      };

      const next = (err) => {
        res.status(500).json({ err });
      };

      const stub = sinon.stub(auth, 'signin').throws();
      sinon.stub(res, 'status').returnsThis();

      await signin(req, res, next);

      (res.status).should.be.calledWith(500);

      stub.restore();
    });
  });
});
