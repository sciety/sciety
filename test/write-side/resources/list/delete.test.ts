import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../../src/domain-events';
import { ErrorMessage } from '../../../../src/types/error-message';
import { delete_ } from '../../../../src/write-side/resources/list';
import { arbitraryListCreatedEvent } from '../../../domain-events/list-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryListId } from '../../../types/list-id.helper';

describe('delete', () => {
  describe('when the list identified in the command exists', () => {
    const listCreatedEvent = arbitraryListCreatedEvent();
    let result: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      result = pipe(
        [
          listCreatedEvent,
        ],
        delete_({ listId: listCreatedEvent.listId }),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('causes a state change in which the list is deleted', () => {
      expect(result).toHaveLength(1);
      expect(result[0]).toBeDomainEvent('ListDeleted', {
        listId: listCreatedEvent.listId,
      });
    });
  });

  describe('when no list with the given id ever existed', () => {
    let result: ErrorMessage;

    beforeEach(() => {
      result = pipe(
        [],
        delete_({ listId: arbitraryListId() }),
        E.matchW(
          identity,
          shouldNotBeCalled,
        ),
      );
    });

    it('rejects the command with not-found', () => {
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
      delete_({ listId: listCreatedEvent.listId }),
    );

    it('accepts the command and does not cause a state change', () => {
      expect(result).toStrictEqual(E.right([]));
    });
  });
});
