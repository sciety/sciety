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

    it('assigns the user as admin of the group', () => {
      expect(result).toHaveLength(1);
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

    it('succeeds and does nothing', () => {
      expect(result).toHaveLength(0);
    });
  });
});
