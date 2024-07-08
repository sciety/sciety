import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events';
import { deleteList } from '../../../../src/write-side/resources/list';
import { arbitraryListCreatedEvent } from '../../../domain-events/list-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryListId } from '../../../types/list-id.helper';

describe('delete', () => {
  describe('when the list identified in the command exists', () => {
    const listCreatedEvent = arbitraryListCreatedEvent();
    const result = pipe(
      [
        listCreatedEvent,
      ],
      deleteList({ listId: listCreatedEvent.listId }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises exactly one event', () => {
      expect(result).toHaveLength(1);
    });

    it('returns a ListDeleted event', () => {
      expect(result[0]).toBeDomainEvent('ListDeleted', {
        listId: listCreatedEvent.listId,
      });
    });
  });

  describe('no list with the given id ever existed', () => {
    const result = pipe(
      [],
      deleteList({ listId: arbitraryListId() }),
      E.matchW(
        identity,
        shouldNotBeCalled,
      ),
    );

    it('fails with not-found', () => {
      expect(result).toBe('not-found');
    });
  });

  describe('when the list identified in the command existed but has been deleted', () => {
    const listCreatedEvent = arbitraryListCreatedEvent();
    const listDeleteEvent = constructEvent('ListDeleted')({ listId: listCreatedEvent.listId });
    const result = pipe(
      [
        listCreatedEvent,
        listDeleteEvent,
      ],
      deleteList({ listId: listCreatedEvent.listId }),
      E.matchW(
        identity,
        shouldNotBeCalled,
      ),
    );

    it('fails with not-found', () => {
      expect(result).toBe('not-found');
    });
  });
});
