import chai, { should } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src';
import models from '../../src/models';
import { user, users as bulkUsers } from '../fixtures/users';
import {
  articles as bulkArticles,
  invalidArticleId as invalidCommentId
} from '../fixtures/articles';
import {
  commentVotes,
  commentDownVotes,
  sampleComments as bulkComments
} from '../fixtures/comments';

chai.use(chaiHttp);

should();

const {
  Users, Articles, Comments, CommentVotes
} = models;

const baseRoute = '/api/v1';

describe('Comments API', () => {
  describe('POST /comments/:commentId/vote', () => {
    let emptyCommentId;
    let comments;
    let userResponseObject;
    let token;

    before(async () => {
      await Users.destroy({ where: {} });
      await Articles.destroy({ where: {} });
      await Comments.destroy({ where: {} });
      await CommentVotes.destroy({ where: {} });

      await Users.bulkCreate(bulkUsers, { returning: true });

      userResponseObject = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      await Articles.bulkCreate(bulkArticles, { returning: true });
      comments = await Comments.bulkCreate(bulkComments, { returning: true });
      await CommentVotes.bulkCreate(commentVotes, { returning: true });
      await CommentVotes.bulkCreate(commentDownVotes, { returning: true });
    });

    after(async () => {
      await Users.destroy({ where: {} });
      await Articles.destroy({ where: {} });
      await Comments.destroy({ where: {} });
      await CommentVotes.destroy({ where: {} });
    });

    it('should throw error if no Id is supplied', async () => {
      ({ token } = userResponseObject.body.data);

      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${emptyCommentId}/vote`)
        .send({ voteType: 'upvote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(400);
      response.body.status.should.eql('error');
    });

    it('should throw error if no vote type is supplied', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${comments[0].dataValues.id}/vote`)
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
        .post(`${baseRoute}/comments/${comments[0].dataValues.id}/vote`)
        .send({ voteType: 'invalid' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(400);
      response.body.status.should.eql('error');
      response.body.error.errors.voteType.should.eql('Enter a valid vote type');
    });

    it('should throw error if comment ID is not a valid UUID', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/invalid-comment-id/vote`)
        .send({ voteType: 'upVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(400);
      response.body.status.should.eql('error');
      response.body.error.errors.commentId.should.eql('Comment id is not a valid uuid');
    });

    it('should throw error if comment does not exist or is suspended', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${invalidCommentId}/vote`)
        .send({ voteType: 'upVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(404);
      response.body.status.should.eql('error');
      response.body.error.message.should.eql('This comment does not exist or has been suspended');
    });

    it('should up vote comment', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${comments[0].dataValues.id}/vote`)
        .send({ voteType: 'upVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(201);
      response.body.status.should.eql('success');
      response.body.message.should.eql('Comment successfully upvoted');
      response.body.data.vote.should.eql(true);
    });

    it('should change vote to down vote', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${comments[0].dataValues.id}/vote`)
        .send({ voteType: 'downVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(200);
      response.body.status.should.eql('success');
      response.body.message.should.eql('Comment successfully downvoted');
      response.body.data.vote.should.eql(false);
    });

    it('should remove vote entry', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${comments[0].dataValues.id}/vote`)
        .send({ voteType: 'nullVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(200);
      response.body.message.should.eql('Vote successfully removed');
    });

    it('should down vote and suspend comment', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${comments[1].dataValues.id}/vote`)
        .send({ voteType: 'downVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(201);
      response.body.message.should.eql('Comment successfully downvoted');
      response.body.data.vote.should.eql(false);
    });

    it('should up vote comment', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${comments[2].dataValues.id}/vote`)
        .send({ voteType: 'upVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(201);
      response.body.status.should.eql('success');
      response.body.message.should.eql('Comment successfully upvoted');
      response.body.data.vote.should.eql(true);
    });

    it('should change vote and suspend comment', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${comments[2].dataValues.id}/vote`)
        .send({ voteType: 'downVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(200);
      response.body.message.should.eql('Comment successfully downvoted');
      response.body.data.vote.should.eql(false);
    });

    it('should up vote comment', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${comments[3].dataValues.id}/vote`)
        .send({ voteType: 'upVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(201);
      response.body.status.should.eql('success');
      response.body.message.should.eql('Comment successfully upvoted');
      response.body.data.vote.should.eql(true);
    });

    it('should change vote and suspend comment', async () => {
      const response = await chai
        .request(app)
        .post(`${baseRoute}/comments/${comments[3].dataValues.id}/vote`)
        .send({ voteType: 'nullVote' })
        .set('authorization', `Bearer ${token}`);

      response.should.have.status(200);
      response.body.message.should.eql('Vote successfully removed');
    });
  });
});
