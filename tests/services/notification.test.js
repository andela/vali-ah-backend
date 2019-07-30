import { should as importedShould } from 'chai';

import notification from '../../src/services/notification';

const should = importedShould();

describe('Notification System', () => {
  it('should return undefined for unsupported types', () => {
    const payload = { type: 'unsupported', email: 'demo@demo.com', userId: 'id' };
    const data = notification.handleNotification(payload);
    should.equal(data, undefined);
  });

  it('should handle notification based on type', () => {
    const payload = { type: 'accountActivation', payload: { email: 'demo@demo.com', userId: 'id' } };
    const data = notification.handleNotification(payload);
    should.not.equal(data, undefined);
  });
});
