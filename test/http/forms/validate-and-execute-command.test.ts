import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { ParameterizedContext } from 'koa';
import { validateAndExecuteCommand, Ports } from '../../../src/http/forms/validate-and-execute-command';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryUserGeneratedInput } from '../../types/user-generated-input.helper';
import { arbitraryUserHandle } from '../../types/user-handle.helper';
import { UserGeneratedInput } from '../../../src/types/user-generated-input';

describe('validate-and-execute-command', () => {
  describe('both user inputs are safe and valid', () => {
    it('succeeds', async () => {
      const user = arbitraryUserDetails();
      const context: ParameterizedContext = ({
        request: {
          body: {
            fullName: arbitraryUserGeneratedInput(),
            handle: arbitraryUserHandle(),
          },
        },
        state: {
          user: {
            id: user.id,
          },
        },
      } as unknown) as ParameterizedContext;
      const adapters: Ports = {
        commitEvents: () => T.of('events-created'),
        getAllEvents: T.of([]),
        lookupUser: () => O.some(user),
      };
      const result = await validateAndExecuteCommand(context, adapters)();

      expect(E.isRight(result)).toBe(true);
    });
  });

  describe('when one or more fields are not present in the form', () => {
    it('returns the form with the valid fields populated', async () => {
      const user = arbitraryUserDetails();
      const handle = arbitraryUserHandle();
      const context: ParameterizedContext = ({
        request: {
          body: {
            handle,
          },
        },
        state: {
          user: {
            id: user.id,
          },
        },
      } as unknown) as ParameterizedContext;
      const adapters: Ports = {
        commitEvents: () => T.of('events-created'),
        getAllEvents: T.of([]),
        lookupUser: () => O.some(user),
      };
      const result = await validateAndExecuteCommand(context, adapters)();

      expect(result).toStrictEqual(E.left({
        fullName: '' as UserGeneratedInput,
        handle,
      }));
    });
  });

  describe.each([
    ['Valid Full Name', '<unsafe>handle', 'full name shown, handle blank'],
    ['Valid Full Name', '"unsafe"handle', 'full name shown, handle blank'],
    ['Valid Full Name', 'invalidhandletoolong', 'full name shown, handle shown'],
    ['<unsafe> Full Name', 'validhandle', 'full name blank, handle shown'],
    ['"unsafe" Full Name', 'validhandle', 'full name blank, handle shown'],
    ['<unsafe> Full Name', '<unsafe>handle', 'full name blank, handle blank'],
    ['<unsafe> Full Name', 'invalidhandletoolong', 'full name blank, handle shown'],
    ['Invalid Full Name Due to being too looooong', 'validhandle', 'full name shown, handle shown'],
    ['Invalid Full Name Due to being too looooong', '<unsafe>handle', 'full name shown, handle blank'],
    ['Invalid Full Name Due to being too looooong', 'invalidhandletoolong', 'full name shown, handle shown'],
  ])('given %s and %s', (fullName, handle, outcome) => {
    it.todo(`${outcome}`);
  });

  describe('when there is no authenticated user', () => {
    it.todo('return an oops page');
  });

  describe('when the user handle already exists', () => {
    it.todo('return a pertinent error summary');

    it.todo('return a form populated with user input');
  });
});
