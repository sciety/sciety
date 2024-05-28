import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { AssignUserAsGroupAdminCommand } from '../../../../src/write-side/commands';
import { create } from '../../../../src/write-side/resources/group-authorisation/create';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('create', () => {
  describe('given an assignment that does not already exist', () => {
    const command: AssignUserAsGroupAdminCommand = {
      groupId: arbitraryGroupId(),
      userId: arbitraryUserId(),
    };
    const result = pipe(
      [],
      create(command),
      E.getOrElseW(shouldNotBeCalled),
    );

    it.failing('assigns the user as admin of the group', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('given an assignment that already exists', () => {
    it.todo('succeeds and does nothing');
  });
});
