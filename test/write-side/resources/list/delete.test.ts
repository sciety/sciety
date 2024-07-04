import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { deleteList } from '../../../../src/write-side/resources/list';
import { arbitraryListCreatedEvent } from '../../../domain-events/list-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';

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

    it.todo('returns a ListDeleted event');
  });

  describe('no list with the given id ever existed', () => {
    it.todo('fails with not-found');
  });

  describe('when the list identified in the command existed but has been deleted', () => {
    it.todo('fails with not-found');
  });
});
