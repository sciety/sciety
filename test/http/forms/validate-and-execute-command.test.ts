import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { ParameterizedContext } from 'koa';
import { validateAndExecuteCommand, Ports } from '../../../src/http/forms/validate-and-execute-command';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryUserGeneratedInput } from '../../types/user-generated-input.helper';
import { arbitraryUserHandle } from '../../types/user-handle.helper';
import { UserGeneratedInput } from '../../../src/types/user-generated-input';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { userCreatedAccount } from '../../../src/domain-events';
import { arbitraryUserId } from '../../types/user-id.helper';

const defaultAdapters: Ports = {
  commitEvents: shouldNotBeCalled,
  getAllEvents: T.of([]),
};

const buildKoaContext = (body: unknown, userId = arbitraryUserId()): ParameterizedContext => ({
  request: { body },
  state: {
    user: { id: userId },
  },
} as unknown) as ParameterizedContext;

describe('validate-and-execute-command', () => {
  describe('both user inputs are safe and valid', () => {
    const formBody = {
      fullName: arbitraryUserGeneratedInput(),
      handle: arbitraryUserHandle(),
    };
    const context = buildKoaContext(formBody);
    const adapters: Ports = {
      ...defaultAdapters,
      commitEvents: () => T.of('events-created'),
    };

    it('succeeds', async () => {
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
      const result = await validateAndExecuteCommand(context, defaultAdapters)();

      expect(result).toStrictEqual(E.left(expectedFormOutput));
    });
  });

  describe('given unsafe or invalid inputs', () => {
    it.each([
      ['Valid Full Name', '<unsafe>handle', { fullName: 'Valid Full Name', handle: '' as UserGeneratedInput }],
      ['Valid Full Name', '"unsafe"handle', { fullName: 'Valid Full Name', handle: '' as UserGeneratedInput }],
      ['Valid Full Name', 'invalidhandletoolong', { fullName: 'Valid Full Name', handle: 'invalidhandletoolong' }],
      ['<unsafe> Full Name', 'validhandle', { fullName: '' as UserGeneratedInput, handle: 'validhandle' }],
      ['"unsafe" Full Name', 'validhandle', { fullName: '' as UserGeneratedInput, handle: 'validhandle' }],
      ['<unsafe> Full Name', '<unsafe>handle', { fullName: '' as UserGeneratedInput, handle: '' as UserGeneratedInput }],
      ['<unsafe> Full Name', 'invalidhandletoolong', { fullName: '' as UserGeneratedInput, handle: 'invalidhandletoolong' }],
      ['Invalid Full Name Due to being too looooong', 'validhandle', { fullName: 'Invalid Full Name Due to being too looooong', handle: 'validhandle' }],
      ['Invalid Full Name Due to being too looooong', '<unsafe>handle', { fullName: 'Invalid Full Name Due to being too looooong', handle: '' as UserGeneratedInput }],
      ['Invalid Full Name Due to being too looooong', 'invalidhandletoolong', { fullName: 'Invalid Full Name Due to being too looooong', handle: 'invalidhandletoolong' }],
    ])('given %s and %s', async (fullNameInput, handleInput, expectedFormOutput) => {
      const user = arbitraryUserDetails();
      const context: ParameterizedContext = ({
        request: {
          body: {
            fullName: fullNameInput,
            handle: handleInput,
          },
        },
        state: {
          user: {
            id: user.id,
          },
        },
      } as unknown) as ParameterizedContext;
      const result = await validateAndExecuteCommand(context, defaultAdapters)();

      expect(result).toStrictEqual(E.left(expectedFormOutput));
    });
  });

  describe('when there is no authenticated user', () => {
    it.todo('return an oops page');
  });

  describe('when the user handle already exists', () => {
    it.todo('return a pertinent error summary');

    it('return a form populated with user input', async () => {
      const user = arbitraryUserDetails();
      const fullName = arbitraryUserGeneratedInput();
      const context: ParameterizedContext = ({
        request: {
          body: {
            fullName,
            handle: user.handle,
          },
        },
        state: {
          user: {
            id: user.id,
          },
        },
      } as unknown) as ParameterizedContext;
      const adapters: Ports = {
        ...defaultAdapters,
        getAllEvents: T.of([
          userCreatedAccount(user.id, user.handle, user.avatarUrl, user.displayName),
        ]),
      };
      const result = await validateAndExecuteCommand(context, adapters)();

      expect(result).toStrictEqual(E.left({
        fullName,
        handle: user.handle,
      }));
    });
  });
});
