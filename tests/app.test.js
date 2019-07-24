import chai, { should } from 'chai';
import chaiHttp from 'chai-http';

import app from '../src';

chai.use(chaiHttp);
should();

describe('Root Route', () => {
  it('should pass on GET/', async () => {
    const response = await chai.request(app).get('/');

    response.should.have.status(200);
    response.body.should.be.a('object');
  });
});

describe('Error Messages', () => {
  it('should display 404 error on invalid route', async () => {
    const response = await chai.request(app).get('/invalid/route');

    response.should.have.status(404);
    response.body.should.be.a('object');
  });
});
