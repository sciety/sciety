import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent, constructEvent } from '../../../../src/domain-events';
import { remove } from '../../../../src/write-side/resources/list-promotion/remove';
import { arbitraryListPromotionRemovedEvent } from '../../../domain-events/list-promotion-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryRemoveListPromotionCommand } from '../../commands/remove-list-promotion-command.helper';

describe('remove', () => {
  const command = arbitraryRemoveListPromotionCommand();
  let result: ReadonlyArray<DomainEvent>;
  const listPromotionCreated = constructEvent('ListPromotionCreated')({ byGroup: command.forGroup, listId: command.listId });
  const listPromotionRemoved = constructEvent('ListPromotionRemoved')({ byGroup: command.forGroup, listId: command.listId });

  describe.each([
    [[listPromotionCreated]],
    // [[listPromotionCreated, arbitraryListPromotionRemovedEvent()]],
  ])('when the list is promoted', (events) => {
    beforeEach(() => {
      result = pipe(
        events,
        remove(command),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('removes the promotion', () => {
      expect(result).toHaveLength(1);
      expect(result[0]).toBeDomainEvent('ListPromotionRemoved', {
        byGroup: command.forGroup,
        listId: command.listId,
      });
    });
  });

  describe.each([
    // [[]],
    [[listPromotionCreated, listPromotionRemoved]],
    // [[arbitraryListPromotionCreatedEvent()]],
    [[listPromotionCreated, listPromotionRemoved, arbitraryListPromotionRemovedEvent()]],
  ])('when the list is not promoted', (events: ReadonlyArray<DomainEvent>) => {
    beforeEach(() => {
      result = pipe(
        events,
        remove(command),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('succeeds, doing nothing', () => {
      expect(result).toHaveLength(0);
    });
  });
});
