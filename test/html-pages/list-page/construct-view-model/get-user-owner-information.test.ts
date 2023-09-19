import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation } from '../../../../src/html-pages/list-page/construct-view-model/get-user-owner-information';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryUserDetails } from '../../../types/user-details.helper';

describe('get-user-owner-information', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when given user exists', () => {
    const user = arbitraryUserDetails();

    beforeEach(async () => {
      await framework.commandHelpers.deprecatedCreateUserAccount(user);
    });

    it('returns the corresponding owner info', () => {
      const ownerInfo = pipe(
        user.id,
        getUserOwnerInformation(framework.dependenciesForViews),
      );

      expect(ownerInfo).toStrictEqual(O.some({
        ownerName: user.displayName,
        ownerAvatarPath: user.avatarUrl,
        ownerHref: `/users/${user.handle}`,
      }));
    });
  });

  describe('when the given user does not exist', () => {
    it('returns a not-found error', () => {
      const ownerInfo = pipe(
        arbitraryUserId(),
        getUserOwnerInformation(framework.dependenciesForViews),
      );

      expect(ownerInfo).toStrictEqual(O.none);
    });
  });
});
