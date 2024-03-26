import * as E from 'fp-ts/Either';
import { DomainEvent } from '../../../../src/domain-events';
import { UserHandle } from '../../../../src/types/user-handle';
import { checkCommand } from '../../../../src/write-side/resources/user/check-command';
import { CreateUserAccountCommand } from '../../../../src/write-side/commands';
import { arbitraryWord, arbitraryString } from '../../../helpers';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { arbitraryUserHandle } from '../../../types/user-handle.helper';
import { arbitraryUserCreatedAccountEvent } from '../../../domain-events/user-resource-events.helper';

describe('check-command', () => {
  describe('when the handle in the command is unique', () => {
    const command: CreateUserAccountCommand = {
      userId: arbitraryUserId(),
      handle: arbitraryUserHandle(),
      displayName: arbitraryString(),
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
    };
    const events = [
      {
        ...arbitraryUserCreatedAccountEvent(),
        handle: userHandle,
      },
    ];
    const result = checkCommand(command)(events);

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
