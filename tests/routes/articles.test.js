import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';

import app from '../../src';
import models from '../../src/models';
import { users as bulkUsers, userToken } from '../fixtures/users';
import { articles as bulkArticles, comment as commentData } from '../fixtures/articles';

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiHttp);

should();

const { Articles, Users } = models;
const baseRoute = '/api/v1';

describe('Articles API', () => {
  describe('POST /articles/:articleId/comment', () => {
    let articles;
    before(async () => {
      await Users.bulkCreate(bulkUsers, { returning: true });

      articles = await Articles.bulkCreate(bulkArticles, { returning: true });
    });

    it('should return 201', async () => {
      const { status } = await chai.request(app)
        .post(`${baseRoute}/articles/${articles[0].id}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData);

      status.should.eql(201);
    });

    it('should return 400', async () => {
      const { status } = await chai.request(app)
        .post(`${baseRoute}/articles/${articles[0].id}/comments`)
        .send({});

      status.should.eql(400);
    });
  });
});
