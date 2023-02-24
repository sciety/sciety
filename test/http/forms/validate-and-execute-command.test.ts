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
    const handle = arbitraryUserHandle();
    const fullName = arbitraryUserGeneratedInput();

    it.each([
      [{ handle }, { fullName: '' as UserGeneratedInput, handle }],
      [{ fullName }, { fullName, handle: '' as UserGeneratedInput }],
      [{ }, { fullName: '' as UserGeneratedInput, handle: '' as UserGeneratedInput }],
    ])('returns the form with any valid fields populated', async (body, expectedFormOutput) => {
      const user = arbitraryUserDetails();
      const context: ParameterizedContext = ({
        request: {
          body,
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

      expect(result).toStrictEqual(E.left(expectedFormOutput));
    });
  });

  describe.skip('given unsafe or invalid inputs', () => {
    const handle = arbitraryUserHandle();
    const fullName = arbitraryUserGeneratedInput();

    it.each([
      ['Valid Full Name', '<unsafe>handle', { fullName, handle: '' as UserGeneratedInput }],
      ['Valid Full Name', '"unsafe"handle', { fullName, handle: '' as UserGeneratedInput }],
      ['Valid Full Name', 'invalidhandletoolong', { fullName, handle }],
      ['<unsafe> Full Name', 'validhandle', { fullName: '' as UserGeneratedInput, handle }],
      ['"unsafe" Full Name', 'validhandle', { fullName: '' as UserGeneratedInput, handle }],
      ['<unsafe> Full Name', '<unsafe>handle', { fullName: '' as UserGeneratedInput, handle: '' as UserGeneratedInput }],
      ['<unsafe> Full Name', 'invalidhandletoolong', { fullName: '' as UserGeneratedInput, handle }],
      ['Invalid Full Name Due to being too looooong', 'validhandle', { fullName, handle }],
      ['Invalid Full Name Due to being too looooong', '<unsafe>handle', { fullName, handle: '' as UserGeneratedInput }],
      ['Invalid Full Name Due to being too looooong', 'invalidhandletoolong', { fullName, handle }],
    ])('given %s and %s', async (fullNameInput, handleInput, expectedFormOutput) => {
      const user = arbitraryUserDetails();
      const context: ParameterizedContext = ({
        request: {
          fullName: fullNameInput,
          handle: handleInput,
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

      expect(result).toStrictEqual(E.left(expectedFormOutput));
    });
  });

  describe('when there is no authenticated user', () => {
    it.todo('return an oops page');
  });

  describe('when the user handle already exists', () => {
    it.todo('return a pertinent error summary');

    it.todo('return a form populated with user input');
  });
});
