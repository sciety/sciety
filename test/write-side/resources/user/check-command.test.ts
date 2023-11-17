import * as E from 'fp-ts/Either';
import { DomainEvent, constructEvent } from '../../../../src/domain-events/index.js';
import { UserHandle } from '../../../../src/types/user-handle.js';
import { checkCommand } from '../../../../src/write-side/resources/user/check-command.js';
import { CreateUserAccountCommand } from '../../../../src/write-side/commands/index.js';
import { arbitraryWord, arbitraryString, arbitraryUri } from '../../../helpers.js';
import { arbitraryUserId } from '../../../types/user-id.helper.js';
import { arbitraryUserHandle } from '../../../types/user-handle.helper.js';

describe('check-command', () => {
  describe('when the handle in the command is unique', () => {
    const command: CreateUserAccountCommand = {
      userId: arbitraryUserId(),
      handle: arbitraryUserHandle(),
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
      constructEvent('UserCreatedAccount')({
        userId: arbitraryUserId(),
        handle: userHandle,
        avatarUrl: arbitraryUri(),
        displayName: arbitraryString(),
      }),
    ];
    const result = checkCommand(command)(events);

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
