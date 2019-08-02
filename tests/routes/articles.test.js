import uuid from 'uuid';
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';

import articleFunc from '../../src/controllers/article';
import app from '../../src';
import models from '../../src/models';
import {
  users as bulkUsers,
  userToken, user, user2
} from '../fixtures/users';
import {
  articles as bulkArticles,
  votes as bulkVotes,
  downVotes as bulkDownVotes,
  comment as commentData,
  invalidArticleId,
  article1,
  article2,
  article3,
  article4,
  badFollowupIdArticle,
  articleNoTag,
  votes1 as bulkVotes1,
  votes2 as bulkVotes2,
  votes3 as bulkVotes3,
  category as bulkTag,
  articleCategories as bulkArticleCategories
} from '../fixtures/articles';
import { myArticles, myComments } from '../fixtures/comments';

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiHttp);

should();

const {
  Articles, Users, Categories, ArticleCategories, Votes, Comments
} = models;
const baseRoute = '/api/v1';
const { updateArticle, createArticle } = articleFunc;

describe('Articles API', () => {
  let users;
  let articles;
  let tag;
  let userAuth1;
  let userAuth2;
  let slug1;
  before(async () => {
    users = await Users.bulkCreate(bulkUsers, { returning: true });
    articles = await Articles.bulkCreate(bulkArticles, { returning: true });
    tag = await Categories.bulkCreate(bulkTag, { returning: true });
    await ArticleCategories.bulkCreate(bulkArticleCategories, { returning: true });
    await Votes.bulkCreate(bulkVotes1, { returning: true });
    await Votes.bulkCreate(bulkVotes2, { returning: true });
    await Votes.bulkCreate(bulkVotes3, { returning: true });
  });

  after(async () => {
    await Users.destroy({ where: {}, });
    await Articles.destroy({ where: {}, });
    await Categories.destroy({ where: {}, });
    await ArticleCategories.destroy({ where: {}, });
  });

  describe('POST /articles/:articleId/comment', () => {
    it('should return 201', async () => {
      const { status } = await chai
        .request(app)
        .post(`${baseRoute}/articles/${articles[0].id}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData);

      status.should.eql(201);
    });

    it('should return 400', async () => {
      const { status } = await chai
        .request(app)
        .post(`${baseRoute}/articles/${articles[0].id}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      status.should.eql(400);
    });
  });

  describe('Search article', () => {
    it('should get all articles', async () => {
      const response = await chai.request(app).get(`${baseRoute}/articles`);
      response.should.have.status(200);
    });

    it('should get users search if tag strings are valid ', async () => {
      const response = await chai.request(app).get(`${baseRoute}/articles?tag=${tag[0].category}`);
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
      const response = await chai.request(app).get(`${baseRoute}/articles?keyword=l`);
      response.should.have.status(200);
    });

    it('should not get user search when is not in the database', async () => {
      const response = await chai.request(app).get(`${baseRoute}/articles?tag=Lagos`);
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
  describe('Post to /articles/', () => {
    before(async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      userAuth1 = res.body.data.token;
      const res2 = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user2);
      userAuth2 = res2.body.data.token;
    });

    it('should be able to create article', async () => {
      const response = await chai.request(app)
        .post(`${baseRoute}/articles`)
        .set('Authorization', `Bearer ${userAuth1}`)
        .send(article1);
      slug1 = response.body.data.slug;

      response.body.status.should.eql('success');
    });

    it('should be able to create articles with no tag', async () => {
      const response = await chai.request(app)
        .post(`${baseRoute}/articles`)
        .set('Authorization', `Bearer ${userAuth1}`)
        .send(articleNoTag);
      slug1 = response.body.data.slug;

      response.body.status.should.eql('success');
    });

    it('should be reject followupId not in articles table', async () => {
      const response = await chai.request(app)
        .post(`${baseRoute}/articles`)
        .set('Authorization', `Bearer ${userAuth1}`)
        .send(badFollowupIdArticle);

      response.body.status.should.eql('error');
    });

    it('should be able to create an article with image sent', async () => {
      const response = await chai.request(app)
        .post(`${baseRoute}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(article1);

      response.body.status.should.eql('error');
    });
  });

  describe('Get /articles/:slug', () => {
    it('should be able to get articles', async () => {
      const response = await chai.request(app)
        .get(`${baseRoute}/articles/${slug1}`)
        .set('Authorization', `Bearer ${userAuth1}`);

      response.status.should.eql(200);
    });

    it('should be able to get articles with votes', async () => {
      const response = await chai.request(app)
        .get(`${baseRoute}/articles/${articles[0].slug}`)
        .set('Authorization', `Bearer ${userAuth1}`);

      response.status.should.eql(200);
    });

    it('should be able to get articles with votes', async () => {
      const response = await chai.request(app)
        .get(`${baseRoute}/articles/${articles[1].slug}`)
        .set('Authorization', `Bearer ${userAuth1}`);

      response.status.should.eql(200);
    });

    it('should be able to get articles with votes', async () => {
      const response = await chai.request(app)
        .get(`${baseRoute}/articles/${articles[2].slug}`)
        .set('Authorization', `Bearer ${userAuth1}`);

      response.status.should.eql(200);
    });

    it('should not found if slug not in database', async () => {
      const response = await chai.request(app)
        .get(`${baseRoute}/articles/slugnotfound`)
        .set('Authorization', `Bearer ${userAuth1}`);

      response.status.should.eql(404);
    });
  });

  describe('Put /articles/:slug', () => {
    it('should be reject followupId not in articles table', async () => {
      const response = await chai.request(app)
        .put(`${baseRoute}/articles/${slug1}`)
        .set('Authorization', `Bearer ${userAuth1}`)
        .send(badFollowupIdArticle);

      response.body.status.should.eql('error');
    });

    it('should reject more than 2 tags', async () => {
      const response = await chai.request(app)
        .put(`${baseRoute}/articles/${slug1}`)
        .set('Authorization', `Bearer ${userAuth1}`)
        .send(article2);

      response.status.should.eql(400);
    });

    it('should reject invalid tag', async () => {
      const response = await chai.request(app)
        .put(`${baseRoute}/articles/${slug1}`)
        .set('Authorization', `Bearer ${userAuth1}`)
        .send(article3);

      response.status.should.eql(400);
    });

    it('should reject tag not yet in category table', async () => {
      const response = await chai.request(app)
        .put(`${baseRoute}/articles/${slug1}`)
        .set('Authorization', `Bearer ${userAuth1}`)
        .send(article4);

      response.status.should.eql(400);
    });

    it('should be able to update their articles', async () => {
      const response = await chai.request(app)
        .put(`${baseRoute}/articles/${slug1}`)
        .set('Authorization', `Bearer ${userAuth1}`)
        .send(article1);

      response.status.should.eql(200);
    });

    it('should be able to update their articles with no tags', async () => {
      const response = await chai.request(app)
        .put(`${baseRoute}/articles/${slug1}`)
        .set('Authorization', `Bearer ${userAuth1}`)
        .send(articleNoTag);

      response.status.should.eql(200);
    });

    it('should be prevent another author from editing other author article', async () => {
      const response = await chai.request(app)
        .put(`${baseRoute}/articles/${slug1}`)
        .set('Authorization', `Bearer ${userAuth2}`)
        .send(article1);

      response.status.should.eql(403);
    });
  });

  describe('Delete /articles/:slug', () => {
    it('should be return not found if slug not in database', async () => {
      const response = await chai.request(app)
        .delete(`${baseRoute}/articles/articlenotfound`)
        .set('Authorization', `Bearer ${userAuth1}`);

      response.status.should.eql(404);
    });

    it('should be able to delete their articles', async () => {
      const response = await chai.request(app)
        .delete(`${baseRoute}/articles/${slug1}`)
        .set('Authorization', `Bearer ${userAuth1}`);

      response.status.should.eql(200);
    });
  });

  describe('image upload in update route', async () => {
    it('should fake image upload', async () => {
      const req = {
        params: { slug: 'head-head' },
        file: { secure_url: 'image.png' },
        body: {}
      };
      const res = {
        status() {},
        json() {}
      };
      const stub = sinon.stub(Articles, 'update').callsFake(() => ([1, [{ id: 'someiD' }]]));

      sinon.stub(res, 'status').returnsThis();
      await updateArticle(req, res);

      (res.status).should.be.calledWith(200);

      stub.restore();
    });
  });

  describe('image upload in create route', async () => {
    it('should fake image upload', async () => {
      const req = {
        file: { secure_url: 'image.png' },
        body: { title: 'some fake article' },
        user: { id: '152788' }
      };
      const res = {
        status() {},
        json() {}
      };
      const stub = sinon.stub(Articles, 'create').callsFake(() => ({}));

      sinon.stub(res, 'status').returnsThis();
      await createArticle(req, res);

      (res.status).should.be.calledWith(201);

      stub.restore();
    });
  });
});

describe('POST /articles/:articleId/vote', () => {
  let emptyArticleId;
  let articles;
  let userResponseObject;
  let token;

  before(async () => {
    await Users.destroy({ where: {}, });
    await Articles.destroy({ where: {}, });
    await Votes.destroy({ where: {}, });

    await Users.bulkCreate(bulkUsers, { returning: true });

    userResponseObject = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user);

    articles = await Articles.bulkCreate(bulkArticles, { returning: true });
    await Votes.bulkCreate(bulkVotes, { returning: true });
    await Votes.bulkCreate(bulkDownVotes, { returning: true });
  });

  after(async () => {
    await Users.destroy({ where: {}, });
    await Articles.destroy({ where: {}, });
    await Votes.destroy({ where: {}, });
  });

  it('should throw error if no Id is supplied', async () => {
    ({ token } = userResponseObject.body.data);

    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${emptyArticleId}/vote`)
      .send({ voteType: 'upvote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(400);
    response.body.status.should.eql('error');
  });

  it('should throw error if no vote type is supplied', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[0].dataValues.id}/vote`)
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(400);
    response.body.status.should.eql('error');
    response.body.error.errors.voteType.should.eql(
      'Vote type is required. e.g upVote, downVote or nullVote'
    );
  });

  it('should throw error if wrong vote type is supplied', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[0].dataValues.id}/vote`)
      .send({ voteType: 'invalid' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(400);
    response.body.status.should.eql('error');
    response.body.error.errors.voteType.should.eql('Enter a valid vote type');
  });

  it('should throw error if article ID is not a valid UUID', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/invalid-article-id/vote`)
      .send({ voteType: 'upVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(400);
    response.body.status.should.eql('error');
    response.body.error.errors.articleId.should.eql('Article id is not a valid uuid');
  });

  it('should throw error if article does not exist or is suspended', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${invalidArticleId}/vote`)
      .send({ voteType: 'upVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(400);
    response.body.status.should.eql('error');
    response.body.error.message.should.eql('This article does not exist or has been suspended');
  });

  it('should up vote article', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[0].dataValues.id}/vote`)
      .send({ voteType: 'upVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(201);
    response.body.status.should.eql('success');
    response.body.message.should.eql('Article successfully upvoted');
    response.body.data.upVote.should.eql(true);
  });

  it('should change vote to down vote', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[0].dataValues.id}/vote`)
      .send({ voteType: 'downVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(200);
    response.body.status.should.eql('success');
    response.body.message.should.eql('Article successfully downvoted');
    response.body.data.upVote.should.eql(false);
  });

  it('should remove vote entry', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[0].dataValues.id}/vote`)
      .send({ voteType: 'nullVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(200);
    response.body.message.should.eql('Vote successfully removed');
  });

  it('should down vote and suspend article', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[1].dataValues.id}/vote`)
      .send({ voteType: 'downVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(201);
    response.body.message.should.eql('Article successfully downvoted');
    response.body.data.upVote.should.eql(false);
  });

  it('should up vote article', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[2].dataValues.id}/vote`)
      .send({ voteType: 'upVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(201);
    response.body.status.should.eql('success');
    response.body.message.should.eql('Article successfully upvoted');
    response.body.data.upVote.should.eql(true);
  });

  it('should change vote and suspend article', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[2].dataValues.id}/vote`)
      .send({ voteType: 'downVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(200);
    response.body.message.should.eql('Article successfully downvoted');
    response.body.data.upVote.should.eql(false);
  });

  it('should up vote article', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[3].dataValues.id}/vote`)
      .send({ voteType: 'upVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(201);
    response.body.status.should.eql('success');
    response.body.message.should.eql('Article successfully upvoted');
    response.body.data.upVote.should.eql(true);
  });

  it('should change vote and suspend article', async () => {
    const response = await chai
      .request(app)
      .post(`${baseRoute}/articles/${articles[3].dataValues.id}/vote`)
      .send({ voteType: 'nullVote' })
      .set('authorization', `Bearer ${token}`);

    response.should.have.status(200);
    response.body.message.should.eql('Vote successfully removed');
  });
});

describe('GET /articles/:articleId/comments', () => {
  let theArticles;
  before(async () => {
    theArticles = await Articles.bulkCreate(myArticles, { returning: true });
    await Comments.bulkCreate(myComments, { returning: true });
  });

  it('should return 200 when an article has no comment', async () => {
    const response = await chai.request(app)
      .get(`${baseRoute}/articles/${theArticles[0].id}/comments`)
      .set('Authorization', `Bearer ${userToken}`);

    response.status.should.eql(200);
    response.body.data.should.be.an('array');
    response.body.data.should.have.length(0);
    response.body.message.should.eql('There is no comment for this article');
  });

  it('should return 200 when an article has only one comment', async () => {
    const response = await chai.request(app)
      .get(`${baseRoute}/articles/${theArticles[1].id}/comments`)
      .set('Authorization', `Bearer ${userToken}`);

    response.status.should.eql(200);
    response.body.data.should.be.a('array');
    response.body.data.should.have.length(1);
    response.body.message.should.eql('Comment retrieved successfully');
  });

  it('should return 200 when an article has more than one comments', async () => {
    const response = await chai.request(app)
      .get(`${baseRoute}/articles/${theArticles[2].id}/comments`)
      .set('Authorization', `Bearer ${userToken}`);

    response.status.should.eql(200);
    response.body.data.should.be.a('array');
    response.body.data.should.have.length(2);
    response.body.message.should.eql('Comments retrieved successfully');
  });

  it('should return 404 error if the articleId does not exist', async () => {
    const nonexistingArticleId = uuid();
    const response = await chai.request(app)
      .get(`${baseRoute}/articles/${nonexistingArticleId}/comments`)
      .set('Authorization', `Bearer ${userToken}`);

    response.status.should.eql(404);
    response.body.error.should.be.a('object');
    response.body.error.message.should.eql('Non-existing articleId');
  });
});
