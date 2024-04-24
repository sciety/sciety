import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import { PromoteListCommand } from '../../../../src/write-side/commands';
import { create } from '../../../../src/write-side/resources/list-promotion';
import { arbitraryListPromotionCreatedEvent } from '../../../domain-events/list-promotion-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryListId } from '../../../types/list-id.helper';

describe('create', () => {
  const command: PromoteListCommand = {
    forGroup: arbitraryGroupId(),
    listId: arbitraryListId(),
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
    it.todo('raises exactly one ListPromotionCreated event');
  });
});
