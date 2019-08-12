/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';
import sinon from 'sinon';
import sinonTest from 'sinon-test';

import Models from '../../src/models';
import { articles } from '../fixtures/articles';

chai.use(chaiAsPromised);

const test = sinonTest(sinon);
const { Articles } = Models;

should();

describe('Articles model', () => {
  const id = faker.random.uuid();
  const commentData = {
    content: faker.lorem.sentences(),
    userId: faker.random.uuid(),
  };

  before(async () => {
    await Articles.destroy({ where: {} });
    await Articles.bulkCreate(articles);
  });

  after(async () => {
    await Articles.destroy({ where: {} });
  });
  afterEach(() => {
    if (Articles.findByPk.restore) Articles.findByPk.restore();
  });

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

  it('should single article if existing', test(async () => {
    const article = await Articles.getSingleArticle(articles[0].id);

    article.id.should.eql(articles[0].id);
  }));

  it('should be rejected if article doesnt exist', test(async () => {
    (Articles.getSingleArticle(faker.random.uuid())).should.be.rejected;
  }));
});
