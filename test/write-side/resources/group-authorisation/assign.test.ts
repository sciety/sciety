import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../../src/domain-events';
import { assign } from '../../../../src/write-side/resources/group-authorisation/assign';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('assign', () => {
  const input = {
    groupId: arbitraryGroupId(),
    userId: arbitraryUserId(),
  };

  describe('given an assignment that does not already exist', () => {
    let result: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      result = pipe(
        [],
        assign(input),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('creates a state change in which the user is assigned as an admin of the group', () => {
      expect(result).toHaveLength(1);
      expect(result[0]).toBeDomainEvent('UserAssignedAsAdminOfGroup', {
        groupId: input.groupId,
        userId: input.userId,
      });
    });
  });

  describe('given an assignment that already exists', () => {
    let result: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      result = pipe(
        [
          constructEvent('UserAssignedAsAdminOfGroup')(input),
        ],
        assign(input),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('accepts the command and causes no state change', () => {
      expect(result).toHaveLength(0);
    });
  });
});
