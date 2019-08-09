import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';

import app from '../../src';
import models from '../../src/models';
import { users as bulkUsers, userToken } from '../fixtures/users';
import {
  articles as bulkArticles,
  comment as commentData,
  category as bulkTag,
  articleCategories as bulkArticleCategories
} from '../fixtures/articles';

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiHttp);

should();

const {
  Articles,
  Users, Categories,
  ArticleCategories
} = models;
const baseRoute = '/api/v1';

describe('Articles API', () => {
  let users;
  let articles;
  let tag;

  before(async () => {
    users = await Users.bulkCreate(bulkUsers, { returning: true });
    articles = await Articles.bulkCreate(bulkArticles, { returning: true });
    tag = await Categories.bulkCreate(bulkTag, { returning: true });
    await ArticleCategories.bulkCreate(bulkArticleCategories, { returning: true });
  });

  describe('POST /articles/:articleId/comment', () => {
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
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      status.should.eql(400);
    });
  });

  describe('Search article', () => {
    it('should get all articles', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/articles`);
      response.should.have.status(200);
    });

    it('should get users search if tag strings are valid ', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/articles?tag=${tag[0].category}`);
      response.should.have.status(200);
    });

    it('should get users search if author for first name strings are valid ', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/articles?author=${users[0].firstName}`);
      response.should.have.status(200);
    });

    it('should get users search if title strings are valid ', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/articles?title=${articles[0].title}`);
      response.should.have.status(200);
    });

    it('should get users search if keyword strings are valid ', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/articles?keyword=l`);
      response.should.have.status(200);
    });

    it('should not get user search when is not in the database', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/articles?tag=Lagos`);
      response.should.have.status(404);
    });

    it('should not get user search when its value is invalid', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/articles?tag=6566`);
      response.should.have.status(400);
    });

    it('should not get users search if two query strings are provided at thesame time ', async () => {
      const response = await chai
        .request(app)
        .get(`${baseRoute}/articles?tag=health&keyword=emotion`);
      response.should.have.status(400);
    });
  });
});
