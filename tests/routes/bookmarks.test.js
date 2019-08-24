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

  after(async () => {
    await Users.destroy({ where: {} });
    await Articles.destroy({ where: {} });
  });

  describe('POST /:articleId/bookmarks/', () => {
    it('should return 201 when user adds a bookmark', async () => {
      const validBookmarkData = {
        articleId: `${bulkArticles[0].id}`,
        user: `${bulkUsers[0].id}`
      };

      const response = await chai
        .request(app)
        .post(`${baseRoute}/articles/${bulkArticles[0].id}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(validBookmarkData);

      response.should.have.status(201);
      response.body.data.should.be.a('Object');
      response.body.should.have.property('data');
      response.body.should.have.property('message').eql('Bookmark added succesfully');
    });

    it('should return 409 - bookmark already added', async () => {
      const validBookmarkData = {
        articleId: `${bulkArticles[0].id}`,
        user: `${bulkUsers[0].id}`
      };
      const response = await chai
        .request(app)
        .post(`${baseRoute}/articles/${bulkArticles[0].id}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(validBookmarkData);

      response.should.have.status(409);
      response.body.should.have.property('error');
    });

    it('should return 404 - article not found', async () => {
      const validBookmarkData = {
        articleId: '88c0bd9a-b83d-11e9-a2a3-2a2ae2dbcce4',
        user: `${bulkUsers[0].id}`
      };
      const response = await chai
        .request(app)
        .post(`${baseRoute}/articles/${validBookmarkData.articleId}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(validBookmarkData);

      response.should.have.status(404);
      response.body.should.have.property('error');
    });
  });

  describe('GET /:articles/bookmarks/', () => {
    it('should get all bookmarks for a user', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/articles/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`);

      response.should.have.status(200);
      response.body.should.have.property('data');
      response.body.should.have.property('count');
    });
  });

  describe('DELETE /:articleId/bookmarks/', () => {
    it('should return 200 if article exists', async () => {
      const validBookmarkData = {
        articleId: `${bulkArticles[0].id}`,
        user: `${bulkUsers[0].id}`
      };

      const response = await chai
        .request(app)
        .delete(`${baseRoute}/articles/${bulkArticles[0].id}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(validBookmarkData);

      response.should.have.status(200);
      response.body.should.have.property('message').eql('Article removed from bookmark');
    });

    it('should return 404 - article not found', async () => {
      const invalidBookmarkData = {
        articleId: '88c0bd9a-b83d-11e9-a2a3-2a2ae2dbcce4',
        user: `${bulkUsers[0].id}`
      };
      const response = await chai
        .request(app)
        .delete(`${baseRoute}/articles/${invalidBookmarkData.articleId}/bookmarks`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidBookmarkData);

      response.should.have.status(404);
      response.body.should.have.property('error');
    });
  });
});
