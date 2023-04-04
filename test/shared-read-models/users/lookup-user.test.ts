import * as O from 'fp-ts/Option';
import { arbitraryUserId } from '../../types/user-id.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryUri } from '../../helpers';

describe('lookup-user', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when user exists', () => {
    const user = arbitraryUserDetails();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(user);
    });

    it('returns the correct user details', () => {
      const result = framework.queries.lookupUser(user.id);

      expect(result).toStrictEqual(O.some(user));
    });
  });

  describe('when avatarUrl has been updated', () => {
    const user = arbitraryUserDetails();
    const newAvatarUrl = arbitraryUri();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(user);
    });

    it.failing('returns the updated avatarUrl', () => {
      const result = framework.queries.lookupUser(user.id);

      expect(result).toStrictEqual(O.some({
        ...user,
        avatarUrl: newAvatarUrl,
      }));
    });
  });

  describe('when user does not exist', () => {
    it('returns None', () => {
      const result = framework.queries.lookupUser(arbitraryUserId());

      expect(result).toStrictEqual(O.none);
    });
  });
});
