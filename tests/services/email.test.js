/* eslint-disable no-unused-expressions */
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';
import sinon from 'sinon';
import sinonTest from 'sinon-test';
import sendgrid from '@sendgrid/mail';

import Email from '../../src/services/email';

chai.use(chaiAsPromised);
const test = sinonTest(sinon);

should();

describe('Email Service', () => {
  const emailData = {
    to: faker.internet.email(),
    from: faker.internet.email(),
    templateId: faker.random.uuid(),
    dynamic_template_data: {
      name: faker.name.findName()
    }
  };

  afterEach(() => {
    if (sendgrid.send.restore) sendgrid.send.restore();
  });

  it('should throw an error if template is not available', async () => {
    const data = await Email({ type: 'unAvailable', payload: emailData });
    data.should.be.instanceof(Error);
  });

  it('should send message with array of mail data', test(async () => {
    sinon.stub(sendgrid, 'send').resolves();

    const response = await Email({ type: 'accountActivation', payload: [emailData] });

    response.should.have.property('message');
  }));

  it('should throw an error if mail data is undefined', test(async () => {
    const data = await Email({ type: 'accountActivation' });
    data.should.be.instanceof(Error);
  }));

  it('should catch sendgrid error', test(async () => {
    sinon.stub(sendgrid, 'send').rejects();

    (Email({ type: 'accountActivation', payload: emailData })).should.eventually.fulfilled;
  }));
});
