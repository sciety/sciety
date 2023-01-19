import * as E from 'fp-ts/Either';
import { DomainEvent } from '../../../src/domain-events/domain-event';
import { userCreatedAccount } from '../../../src/domain-events/user-created-account-event';
import { UserHandle } from '../../../src/types/user-handle';
import { checkCommand } from '../../../src/write-side/create-user-account/check-command';
import { CreateUserAccountCommand } from '../../../src/write-side/commands';
import { arbitraryWord, arbitraryString, arbitraryUri } from '../../helpers';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('check-command', () => {
  describe('when the handle in the command is unique', () => {
    const command: CreateUserAccountCommand = {
      userId: arbitraryUserId(),
      handle: arbitraryWord() as UserHandle,
      displayName: arbitraryString(),
      avatarUrl: arbitraryUri(),
    };
    const events = [] as ReadonlyArray<DomainEvent>;
    const result = checkCommand(command)(events);

    it('returns the command', () => {
      expect(result).toStrictEqual(E.right(command));
    });
  });

  describe('when the handle in the command is not unique', () => {
    const userHandle = arbitraryWord() as UserHandle;
    const command: CreateUserAccountCommand = {
      userId: arbitraryUserId(),
      handle: userHandle,
      displayName: arbitraryString(),
      avatarUrl: arbitraryUri(),
    };
    const events = [
      userCreatedAccount(arbitraryUserId(), userHandle, arbitraryUri(), arbitraryString()),
    ];
    const result = checkCommand(command)(events);

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
