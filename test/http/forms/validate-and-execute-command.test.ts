import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { ParameterizedContext } from 'koa';
import { validateAndExecuteCommand, Dependencies } from '../../../src/write-side/forms/create-user/validate-and-execute-command';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryUserGeneratedInput } from '../../types/user-generated-input.helper';
import { arbitraryUserHandle } from '../../types/user-handle.helper';
import { UserGeneratedInput } from '../../../src/types/user-generated-input';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { constructEvent } from '../../../src/domain-events';
import { arbitraryUserId } from '../../types/user-id.helper';
import { dummyLogger } from '../../dummy-logger';

const defaultDependencies: Dependencies = {
  commitEvents: shouldNotBeCalled,
  getAllEvents: T.of([]),
  logger: dummyLogger,
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
    const koaContext = buildKoaContext(formBody);
    const dependencies: Dependencies = {
      ...defaultDependencies,
      commitEvents: () => TE.right('events-created'),
    };

    it('succeeds', async () => {
      const result = await validateAndExecuteCommand(koaContext, dependencies)();

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ])('returns the form with any valid fields populated', async (body, expectedFormOutput) => {
      const koaContext = buildKoaContext(body);
      const result = await validateAndExecuteCommand(koaContext, defaultDependencies)();

      expect(result).toStrictEqual(E.left('validation-error'));
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ])('given %s and %s', async (fullNameInput, handleInput, expectedFormOutput) => {
      const formBody = { fullName: fullNameInput, handle: handleInput };
      const koaContext = buildKoaContext(formBody);
      const result = await validateAndExecuteCommand(koaContext, defaultDependencies)();

      expect(result).toStrictEqual(E.left('validation-error'));
    });
  });

  describe('when there is no authenticated user', () => {
    it.todo('return an oops page');
  });

  describe('when the user handle already exists', () => {
    const existingUser = arbitraryUserDetails();
    const formBody = { fullName: arbitraryUserGeneratedInput(), handle: existingUser.handle };
    const dependencies: Dependencies = {
      ...defaultDependencies,
      getAllEvents: T.of([
        constructEvent('UserCreatedAccount')({
          ...existingUser,
          userId: existingUser.id,
        }),
      ]),
    };
    const koaContext = buildKoaContext(formBody, existingUser.id);

    it('return a form validation error', async () => {
      const result = await validateAndExecuteCommand(koaContext, dependencies)();

      expect(result).toStrictEqual(E.left('command-failed'));
    });
  });
});
