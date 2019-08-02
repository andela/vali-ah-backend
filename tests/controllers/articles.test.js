/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonTest from 'sinon-test';

import Articles from '../../src/services/articles';
import { createComment } from '../../src/controllers/article';

chai.use(chaiAsPromised);
chai.use(sinonChai);

const test = sinonTest(sinon);

should();

describe('Articles Controller', () => {
  const id = faker.random.uuid();

  const commentData = {
    content: faker.lorem.sentences(),
    userId: faker.random.uuid(),
  };

  const request = {
    params: { article: id },
    user: { id },
    body: commentData
  };

  afterEach(() => {
    Articles.createComment.restore();
  });

  it('should return created comment if article exist', test(async () => {
    sinon.stub(Articles, 'createComment').callsFake(() => ({ id, ...commentData }));

    const createdComment = await createComment(request);

    createdComment.should.have.property('data');
    createdComment.status.should.eql(201);
  }));

  it('should throw an error if article doesnt exist', test(async () => {
    sinon.stub(Articles, 'createComment').callsFake(() => {
      throw new Error('Article doesnt exist');
    });

    createComment(request).should.eventually.rejected;
  }));
});
