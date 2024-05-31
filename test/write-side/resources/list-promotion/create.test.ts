import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import { create } from '../../../../src/write-side/resources/list-promotion';
import { arbitraryListPromotionCreatedEvent } from '../../../domain-events/list-promotion-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryPromoteListCommand } from '../../commands/promote-list-command.helper';

describe('create', () => {
  const command = arbitraryPromoteListCommand();
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
          {
            ...arbitraryListPromotionCreatedEvent(),
            listId: command.listId,
            byGroup: command.forGroup,
          },
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
      result = pipe(
        [
          {
            ...arbitraryListPromotionCreatedEvent(),
            listId: command.listId,
          },
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
    beforeEach(() => {
      result = pipe(
        [
          {
            ...arbitraryListPromotionCreatedEvent(),
            byGroup: command.forGroup,
          },
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
    it.todo('raises ListPromotionCreated event');
  });
});
