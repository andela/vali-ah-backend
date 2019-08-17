/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import Similarity from '../../src/helpers/cosine';


chai.use(chaiAsPromised);
chai.use(sinonChai);

chai.use(chaiAsPromised);

should();

describe('Cosine similarity', () => {
  it('should return 0 for dissimilar words', async () => {
    const sentenceOne = 'first absent';
    const sentenceTwo = 'second present';
    const similar = Similarity(sentenceOne, sentenceTwo);

    similar.should.to.be.eql(0);
  });

  it('should return 1 for totally similar words', async () => {
    const sentenceOne = 'first absent';
    const similar = Similarity(sentenceOne, sentenceOne);

    similar.should.to.be.eql(1);
  });

  it('should return 0.5 for partially similar words', async () => {
    const sentenceOne = 'first absent';
    const sentenceTwo = 'first present';
    const similar = Similarity(sentenceOne, sentenceTwo);

    similar.should.to.be.eql(0.5);
  });
});
