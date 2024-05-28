import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events';
import { create } from '../../../../src/write-side/resources/group-authorisation/create';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('create', () => {
  const input = {
    groupId: arbitraryGroupId(),
    userId: arbitraryUserId(),
  };

  describe('given an assignment that does not already exist', () => {
    const result = pipe(
      [],
      create(input),
      E.getOrElseW(shouldNotBeCalled),
    );

    it.failing('assigns the user as admin of the group', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('given an assignment that already exists', () => {
    const result = pipe(
      [
        constructEvent('UserAssignedAsAdminOfGroup')(input),
      ],
      create(input),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('succeeds and does nothing', () => {
      expect(result).toHaveLength(0);
    });
  });
});
