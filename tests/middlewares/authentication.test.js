import { should } from 'chai';
import authentication from '../../src/middlewares/authentication';
import { ApplicationError } from '../../src/helpers/errors';

should();

describe('isAdmin middleware', () => {
  it('should not throw an error when the isAdmin property is present in the user object', () => {
    const request = {
      user: {
        isAdmin: true,
      }
    };
    try {
      authentication.isAdmin(request);
    } catch (error) {
      error.should.be.eql(undefined);
    }
  });

  it('should throw an error when the isAdmin property is absent in the user object', () => {
    try {
      authentication.isAdmin({ user: '' });
    } catch (error) {
      error.should.not.be.eql(undefined);
      error.should.be.instanceOf(ApplicationError);
    }
  });
});
