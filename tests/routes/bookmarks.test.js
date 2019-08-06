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

describe('Bookmark Endpoint', () => {
  before(async () => {
    await Users.destroy({ where: {} });
    await Articles.destroy({ where: {} });
    await Users.bulkCreate(bulkUsers, { returning: true });

    await Articles.bulkCreate(bulkArticles, { returning: true });
  });
  describe('user adds article to bookmark - POST request to /:articleId/bookmarks/', () => {
    it('should return 201 when user adds a bookmark', async () => {
      const validBookmarkData = {
        articleId: `${bulkArticles[0].id}`,
        user: `${bulkUsers[0].id}`
      };

      const { status } = await chai.request(app)
        .post(`${baseRoute}/articles/${bulkArticles[0].id}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(validBookmarkData);

      status.should.eql(201);
    });

    it('should return 409 - bookmark already added', async () => {
      const validBookmarkData = {
        articleId: `${bulkArticles[0].id}`,
        user: `${bulkUsers[0].id}`
      };
      const { status } = await chai.request(app)
        .post(`${baseRoute}/articles/${bulkArticles[0].id}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(validBookmarkData);

      status.should.eql(409);
    });

    it('should return 404 - article not found', async () => {
      const validBookmarkData = {
        articleId: '88c0bd9a-b83d-11e9-a2a3-2a2ae2dbcce4',
        user: `${bulkUsers[0].id}`
      };
      const { status } = await chai.request(app)
        .post(`${baseRoute}/articles/${validBookmarkData.articleId}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(validBookmarkData);

      status.should.eql(404);
    });
  });
  describe('user removes article from bookmark - DELETE request to /:articleId/bookmarks/', () => {
    it('should return 200 if article exists', async () => {
      const validBookmarkData = {
        articleId: `${bulkArticles[0].id}`,
        user: `${bulkUsers[0].id}`
      };

      const { status } = await chai.request(app)
        .delete(`${baseRoute}/articles/${bulkArticles[0].id}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(validBookmarkData);

      status.should.eql(200);
    });

    it('should return 404 - article not found', async () => {
      const invalidBookmarkData = {
        articleId: '88c0bd9a-b83d-11e9-a2a3-2a2ae2dbcce4',
        user: `${bulkUsers[0].id}`
      };
      const { status } = await chai.request(app)
        .delete(`${baseRoute}/articles/${invalidBookmarkData.articleId}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidBookmarkData);

      status.should.eql(404);
    });
  });
});
