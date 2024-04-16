import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails } from '../../../../../src/html-pages/group-page/group-followers-page/construct-view-model/augment-with-user-details';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryNumber } from '../../../../helpers';
import { arbitraryUserId } from '../../../../types/user-id.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';

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
    const createUserAccount1 = arbitraryCreateUserAccountCommand();
    const createUserAccount2 = arbitraryCreateUserAccountCommand();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccount2);
      await framework.commandHelpers.createUserAccount(createUserAccount1);
    });

    it('returns the user card view models in the same order as the input followers', () => {
      const followers = [
        {
          userId: createUserAccount1.userId,
          listCount: arbitraryNumber(0, 10),
          followedGroupCount: arbitraryNumber(0, 10),
        },
        {
          userId: createUserAccount2.userId,
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
        createUserAccount1.handle,
        createUserAccount2.handle,
      ]);
    });
  });
});
