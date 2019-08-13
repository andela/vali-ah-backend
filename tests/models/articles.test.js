/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';
import sinon from 'sinon';
import sinonTest from 'sinon-test';

import Models from '../../src/models';
import { articles } from '../fixtures/articles';
import { inlineComments } from '../fixtures/comments';

chai.use(chaiAsPromised);

const test = sinonTest(sinon);
const { Articles, InlineComments } = Models;

should();

describe('Articles model', () => {
  const id = faker.random.uuid();
  const commentData = {
    content: faker.lorem.sentences(),
    userId: faker.random.uuid(),
  };

  before(async () => {
    articles[2].body = faker.lorem.sentence().split(' ').join('-');

    await Articles.destroy({ where: {} });
    await Articles.bulkCreate(articles);
  });

  after(async () => {
    await Articles.destroy({ where: {} });
    await InlineComments.destroy({ where: {} });
  });

  afterEach(() => {
    if (Articles.findByPk.restore) Articles.findByPk.restore();
  });

  describe('Create Comment', () => {
    it('should return created comment if article exist', test(async () => {
      sinon.stub(Articles, 'findByPk').callsFake(() => ({
        createComment() {
          return { id, ...commentData };
        }
      }));

      const comment = await Articles.createComment({ article: id, comment: commentData });

      comment.should.have.property('id');
    }));

    it('should return error if article doenst exist', test(async () => {
      sinon.stub(Articles, 'findByPk').returns(null);

      const comment = { article: id, comment: commentData };

      (Articles.createComment(comment)).should.eventually.rejected;
    }));
  });

  describe('Query article', () => {
    it('should return single article if existing', test(async () => {
      const article = await Articles.getSingleArticle(articles[0].id);

      article.id.should.eql(articles[0].id);
    }));

    it('should be rejected if article doesnt exist', test(async () => {
      (Articles.getSingleArticle(faker.random.uuid())).should.be.rejected;
    }));
  });

  describe('Inline comment', () => {
    it('should create inline comments for an article', test(async () => {
      const { startIndex, endIndex } = inlineComments[0];
      const highlightedText = articles[0].body.substring(startIndex, endIndex);
      const inlineCommentData = { ...inlineComments[0], highlightedText };

      const createdArticle = await Articles.createInlineComment(articles[0].id, inlineCommentData);

      createdArticle.articleId.should.eql(articles[0].id);
      createdArticle.context.should.not.be.undefined;
    }));

    it('should normalize an articles inline comment', test(async () => {
      const { startIndex, endIndex } = inlineComments[1];
      const highlightedText = articles[1].body.substring(startIndex, endIndex);
      const inlineCommentData = { ...inlineComments[1], highlightedText };

      await Articles.createInlineComment(articles[0].id, inlineCommentData);

      const article = await Articles.findByPk(articles[0].id);
      const comment = await Articles.normalizeInlineComments(article);

      comment.should.be.an('array');
    }));

    it('should get inline comments data for an article', test(async () => {
      const { startIndex, endIndex } = inlineComments[0];
      const highlightedText = articles[0].body.substring(startIndex, endIndex);
      const inlineCommentData = { ...inlineComments[0], highlightedText };

      const createdCommentData = await Articles
        .getInlineCommentData(articles[0].id, inlineCommentData);

      createdCommentData.articleId.should.eql(articles[0].id);
      createdCommentData.should.have.property('contextIndex');
      createdCommentData.context.should.not.be.undefined;
    }));

    it('should get inline comments data for an article', test(async () => {
      const { startIndex, endIndex } = inlineComments[0];
      const highlightedText = articles[0].body.substring(startIndex, endIndex);
      const inlineCommentData = { ...inlineComments[0], highlightedText };

      const createdCommentData = await Articles
        .getInlineCommentData(articles[0].id, {
          ...inlineCommentData, startIndex: 35, endIndex: 40
        });

      createdCommentData.articleId.should.eql(articles[0].id);
      createdCommentData.should.have.property('contextIndex');
      createdCommentData.context.should.not.be.undefined;
    }));

    it('should get inline comments data for an article with negative index', test(async () => {
      const { startIndex, endIndex } = inlineComments[0];
      const highlightedText = articles[0].body.substring(startIndex, endIndex);
      const inlineCommentData = { ...inlineComments[0], highlightedText };

      const createdCommentData = await Articles
        .getInlineCommentData(articles[2].id, { ...inlineCommentData, startIndex: 5, endIndex: 5 });

      createdCommentData.articleId.should.eql(articles[2].id);
      createdCommentData.should.have.property('contextIndex');
      createdCommentData.context.should.not.be.undefined;
    }));

    it('should throw 404 for non existing inline comment', test(async () => {
      const { startIndex, endIndex } = inlineComments[0];
      const highlightedText = articles[0].body.substring(startIndex, endIndex);
      const inlineCommentData = { ...inlineComments[0], highlightedText };

      (Articles.getInlineCommentData(faker.random.uuid(), inlineCommentData))
        .should.be.rejected;
    }));
  });
});
