import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import { create } from '../../../../src/write-side/resources/list-promotion';
import { arbitraryListPromotionCreatedEvent, arbitraryListPromotionRemovedEvent } from '../../../domain-events/list-promotion-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryPromoteListCommand } from '../../commands/promote-list-command.helper';

describe('create', () => {
  const command = arbitraryPromoteListCommand();
  const listPromoted = {
    ...arbitraryListPromotionCreatedEvent(),
    byGroup: command.forGroup,
    listId: command.listId,
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const listPromotionRemoved = {
    ...arbitraryListPromotionRemovedEvent(),
    byGroup: command.forGroup,
    listId: command.listId,
  };
  const otherGroupPromotedList = {
    ...arbitraryListPromotionCreatedEvent(),
    listId: command.listId,
  };
  const otherListPromoted = {
    ...arbitraryListPromotionCreatedEvent(),
    byGroup: command.forGroup,
  };

  let result: ReadonlyArray<DomainEvent>;

  describe.each([
    [[]],
    [[otherGroupPromotedList]],
    [[otherListPromoted]],
    // [[listPromoted, listPromotionRemoved]],
  ])('when the list is currently not promoted by the group', (events) => {
    beforeEach(() => {
      result = pipe(
        events,
        create(command),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('raises exactly one ListPromotionCreated event', () => {
      expect(result).toHaveLength(1);
      expect(result[0]).toBeDomainEvent('ListPromotionCreated', {
        byGroup: command.forGroup,
        listId: command.listId,
      });
    });
  });

  describe('when given the id of a list that the group has already promoted', () => {
    beforeEach(() => {
      result = pipe(
        [
          listPromoted,
        ],
        create(command),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('raises no events', () => {
      expect(result).toHaveLength(0);
    });
  });
});
