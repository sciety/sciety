import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events';
import { create } from '../../../../src/write-side/resources/list/create';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';

describe('create', () => {
  const input = {
    listId: arbitraryListId(),
    ownerId: arbitraryListOwnerId(),
    name: arbitraryString(),
    description: arbitraryString(),
  };

  describe('when a list with the given listId has never been created', () => {
    const result = pipe(
      [],
      create(input),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises exactly one event', () => {
      expect(result).toHaveLength(1);
    });

    it('returns a ListCreated event', () => {
      expect(result[0]).toBeDomainEvent('ListCreated', {
        listId: input.listId,
        ownerId: input.ownerId,
        name: input.name,
        description: input.description,
      });
    });
  });

  describe('when a list with the given listId has been created and not deleted', () => {
    const result = pipe(
      [
        constructEvent('ListCreated')({
          listId: input.listId,
          name: arbitraryString(),
          description: arbitraryString(),
          ownerId: arbitraryListOwnerId(),
        }),
      ],
      create(input),
    );

    it('accepts the command and does not cause a state change', () => {
      expect(result).toStrictEqual(E.right([]));
    });
  });

  describe('when a list with the given listId has been created and then deleted', () => {
    const result = pipe(
      [
        constructEvent('ListCreated')({
          listId: input.listId,
          name: arbitraryString(),
          description: arbitraryString(),
          ownerId: arbitraryListOwnerId(),
        }),
        constructEvent('ListDeleted')({ listId: input.listId }),
      ],
      create(input),
    );

    it('rejects the command', () => {
      expect(result).toStrictEqual(E.left('list-id-has-already-been-used'));
    });
  });
});
