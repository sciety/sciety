import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { ParameterizedContext } from 'koa';
import { validateAndExecuteCommand, Dependencies } from '../../../src/http/form-submission-handlers/validate-and-execute-command';
import { SanitisedUserInput } from '../../../src/types/sanitised-user-input';
import { arbitraryUserCreatedAccountEvent } from '../../domain-events/user-resource-events.helper';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitrarySanitisedUserInput } from '../../types/sanitised-user-input.helper';
import { arbitraryUserHandle } from '../../types/user-handle.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

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
      fullName: arbitrarySanitisedUserInput(),
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
    const fullName = arbitrarySanitisedUserInput();

    it.each([
      [{ handle }, { fullName: '' as SanitisedUserInput, handle }],
      [{ fullName }, { fullName, handle: '' as SanitisedUserInput }],
      [{ }, { fullName: '' as SanitisedUserInput, handle: '' as SanitisedUserInput }],
    ])('returns the form with any valid fields populated', async (body, expectedFormOutput) => {
      const koaContext = buildKoaContext(body);
      const result = await validateAndExecuteCommand(koaContext, defaultDependencies)();

      expect(result).toStrictEqual(E.left(expectedFormOutput));
    });
  });

  describe('given unsafe or invalid inputs', () => {
    it.each([
      ['Valid Full Name', '<unsafe>handle', { fullName: 'Valid Full Name', handle: '' as SanitisedUserInput }],
      ['Valid Full Name', '"unsafe"handle', { fullName: 'Valid Full Name', handle: '' as SanitisedUserInput }],
      ['Valid Full Name', 'invalidhandletoolong', { fullName: 'Valid Full Name', handle: 'invalidhandletoolong' }],
      ['<unsafe> Full Name', 'validhandle', { fullName: '' as SanitisedUserInput, handle: 'validhandle' }],
      ['"unsafe" Full Name', 'validhandle', { fullName: '' as SanitisedUserInput, handle: 'validhandle' }],
      ['<unsafe> Full Name', '<unsafe>handle', { fullName: '' as SanitisedUserInput, handle: '' as SanitisedUserInput }],
      ['<unsafe> Full Name', 'invalidhandletoolong', { fullName: '' as SanitisedUserInput, handle: 'invalidhandletoolong' }],
      ['Invalid Full Name Due to being too looooong', 'validhandle', { fullName: 'Invalid Full Name Due to being too looooong', handle: 'validhandle' }],
      ['Invalid Full Name Due to being too looooong', '<unsafe>handle', { fullName: 'Invalid Full Name Due to being too looooong', handle: '' as SanitisedUserInput }],
      ['Invalid Full Name Due to being too looooong', 'invalidhandletoolong', { fullName: 'Invalid Full Name Due to being too looooong', handle: 'invalidhandletoolong' }],
    ])('given %s and %s', async (fullNameInput, handleInput, expectedFormOutput) => {
      const formBody = { fullName: fullNameInput, handle: handleInput };
      const koaContext = buildKoaContext(formBody);
      const result = await validateAndExecuteCommand(koaContext, defaultDependencies)();

      expect(result).toStrictEqual(E.left(expectedFormOutput));
    });
  });

  describe('when the user handle already exists', () => {
    const userCreatedAccountEvent = arbitraryUserCreatedAccountEvent();
    const dependencies: Dependencies = {
      ...defaultDependencies,
      getAllEvents: T.of([userCreatedAccountEvent]),
    };
    const formBody = {
      fullName: arbitrarySanitisedUserInput(),
      handle: userCreatedAccountEvent.handle,
    };
    const koaContext = buildKoaContext(formBody, userCreatedAccountEvent.userId);

    it('return a form populated with user input', async () => {
      const result = await validateAndExecuteCommand(koaContext, dependencies)();

      expect(result).toStrictEqual(E.left({
        fullName: formBody.fullName,
        handle: userCreatedAccountEvent.handle,
      }));
    });
  });
});
