/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';
import sinon from 'sinon';
import sinonTest from 'sinon-test';

import Articles from '../../src/services/articles';

chai.use(chaiAsPromised);

const test = sinonTest(sinon);

should();

describe('Articles Service', () => {
  const id = faker.random.uuid();
  const commentData = {
    content: faker.lorem.sentences(),
    userId: faker.random.uuid(),
  };

  afterEach(() => {
    Articles.model.findByPk.restore();
  });

  it('should return created comment if article exist', test(async () => {
    sinon.stub(Articles.model, 'findByPk').callsFake(() => ({
      createComment() {
        return { id, ...commentData };
      }
    }));

    const comment = await Articles.createComment({ article: id, comment: commentData });

    comment.should.have.property('id');
  }));

  it('should return error if article doenst exist', test(async () => {
    sinon.stub(Articles.model, 'findByPk').returns(null);

    const comment = { article: id, comment: commentData };

    (Articles.createComment(comment)).should.eventually.rejected;
  }));
});
