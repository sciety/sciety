import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { checkCommand } from '../../src/http/forms/create-user-account';
import { UserHandle } from '../../src/types/user-handle';
import { arbitraryWord, arbitraryString, arbitraryUri } from '../helpers';
import { arbitraryUserId } from '../types/user-id.helper';

describe('check-command', () => {
  describe('when the handle in the command is unique', () => {
    const command = {
      id: arbitraryUserId(),
      handle: arbitraryWord() as UserHandle,
      displayName: arbitraryString(),
      avatarUrl: arbitraryUri(),
    };
    const adapters = {
      getAllEvents: T.of([]),
    };
    const result = checkCommand(adapters)(command);

    it.failing('returns the command', () => {
      expect(result).toStrictEqual(E.right(command));
    });
  });

  describe('when the handle in the command is not unique', () => {
    it.todo('returns an error message');
  });
});
