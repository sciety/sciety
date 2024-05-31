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
  const listPromotionRemoved = {
    ...arbitraryListPromotionRemovedEvent(),
    byGroup: command.forGroup,
    listId: command.listId,
  };
  let result: ReadonlyArray<DomainEvent>;

  describe('when given the id of a list that the group has never before promoted', () => {
    beforeEach(() => {
      result = pipe(
        [],
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

  describe('when given the id of a list that a different group has already promoted', () => {
    beforeEach(() => {
      const otherGroupPromotedList = {
        ...arbitraryListPromotionCreatedEvent(),
        listId: command.listId,
      };
      result = pipe(
        [
          otherGroupPromotedList,
        ],
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

  describe('when the group has already promoted a different list', () => {
    const otherListPromoted = {
      ...arbitraryListPromotionCreatedEvent(),
      byGroup: command.forGroup,
    };

    beforeEach(() => {
      result = pipe(
        [
          otherListPromoted,
        ],
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

  describe('when the list is not currently promoted by the group, but was promoted in the past', () => {
    beforeEach(() => {
      result = pipe(
        [
          listPromoted,
          listPromotionRemoved,
        ],
        create(command),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it.failing('raises ListPromotionCreated event', () => {
      expect(result).toHaveLength(1);
      expect(result[0]).toBeDomainEvent('ListPromotionCreated', {
        byGroup: command.forGroup,
        listId: command.listId,
      });
    });
  });
});
