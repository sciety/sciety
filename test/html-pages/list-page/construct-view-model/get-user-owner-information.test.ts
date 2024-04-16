import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation } from '../../../../src/html-pages/list-page/construct-view-model/get-user-owner-information';
import { TestFramework, createTestFramework } from '../../../framework';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';

describe('get-user-owner-information', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when given user exists', () => {
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
    });

    it('returns the corresponding owner info', () => {
      const ownerInfo = pipe(
        createUserAccountCommand.userId,
        getUserOwnerInformation(framework.dependenciesForViews),
        O.getOrElseW(shouldNotBeCalled),
      );

      expect(ownerInfo.ownerName).toStrictEqual(createUserAccountCommand.displayName);
      expect(ownerInfo.ownerAvatarSrc).toContain(createUserAccountCommand.handle);
      expect(ownerInfo.ownerHref).toContain(createUserAccountCommand.handle);
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
