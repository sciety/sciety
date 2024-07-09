import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { deleteList } from '../../../../src/write-side/resources/list';
import { arbitraryListCreatedEvent } from '../../../domain-events/list-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('delete', () => {
  describe('given a command', () => {
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
});
