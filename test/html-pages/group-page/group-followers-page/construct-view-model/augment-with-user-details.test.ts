import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails } from '../../../../../src/html-pages/group-page/group-followers-page/construct-view-model/augment-with-user-details';
import { arbitraryNumber } from '../../../../helpers';
import { arbitraryUserId } from '../../../../types/user-id.helper';
import { arbitraryUserDetails } from '../../../../types/user-details.helper';
import { TestFramework, createTestFramework } from '../../../../framework';

describe('augment-with-user-details', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when a following user does not exist', () => {
    it('returns a shorter array of user card view models', () => {
      const followers = [
        {
          userId: arbitraryUserId(),
          listCount: arbitraryNumber(0, 10),
          followedGroupCount: arbitraryNumber(0, 10),
        },
      ];
      const results = pipe(
        followers,
        augmentWithUserDetails(framework.queries),
      );

      expect(results).toHaveLength(0);
    });
  });

  describe('when the following users do exist', () => {
    const user1 = arbitraryUserDetails();
    const user2 = arbitraryUserDetails();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(user2);
      await framework.commandHelpers.createUserAccount(user1);
    });

    it('returns the user card view models in the same order as the input followers', () => {
      const followers = [
        {
          userId: user1.id,
          listCount: arbitraryNumber(0, 10),
          followedGroupCount: arbitraryNumber(0, 10),
        },
        {
          userId: user2.id,
          listCount: arbitraryNumber(0, 10),
          followedGroupCount: arbitraryNumber(0, 10),
        },
      ];
      const handles = pipe(
        followers,
        augmentWithUserDetails(framework.queries),
        RA.map((user) => user.handle),
      );

      expect(handles).toStrictEqual([
        user1.handle,
        user2.handle,
      ]);
    });
  });
});
