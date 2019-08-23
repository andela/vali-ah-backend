import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';

import app from '../../src';
import models from '../../src/models';
import { userToken, users as bulkUsers } from '../fixtures/users';
import { articles as bulkArticles } from '../fixtures/articles';

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiHttp);

should();

const { Users, Articles } = models;
const baseRoute = '/api/v1';

describe('Authors Endpoint', () => {
  before(async () => {
    await Users.destroy({ where: {} });
    await Articles.destroy({ where: {} });
    await Users.bulkCreate(bulkUsers, { returning: true });

    await Articles.bulkCreate(bulkArticles, { returning: true });
  });

  describe('GET request to /authors/', () => {
    it('should return a list of all authors', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/authors/`)
        .set('Authorization', `Bearer ${userToken}`);

      response.should.have.status(200);
      response.body.data.should.be.a('Array');
      response.body.data[0].should.have.property('authorId');
    });

    it('should return an empty array', async () => {
      await Articles.destroy({ where: {} });
      const response = await chai
        .request(app)
        .get(`${baseRoute}/authors/`)
        .set('Authorization', `Bearer ${userToken}`);

      response.should.have.status(200);
      response.body.data.should.be.a('Array');
      response.body.data.length.should.eql(0);
    });
  });
});
