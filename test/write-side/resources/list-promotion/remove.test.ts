import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent, constructEvent } from '../../../../src/domain-events';
import { remove } from '../../../../src/write-side/resources/list-promotion/remove';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryRemoveListPromotionCommand } from '../../commands/remove-list-promotion-command.helper';

describe('remove', () => {
  const command = arbitraryRemoveListPromotionCommand();
  let result: ReadonlyArray<DomainEvent>;

  describe('when the list is promoted', () => {
    beforeEach(() => {
      result = pipe(
        [
          constructEvent('ListPromotionCreated')({ byGroup: command.forGroup, listId: command.listId }),
        ],
        remove(command),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it.failing('removes the promotion', () => {
      expect(result).toHaveLength(1);
      expect(result[0]).toBeDomainEvent('ListPromotionRemoved', {
        byGroup: command.forGroup,
        listId: command.listId,
      });
    });
  });

  describe('when the list is not promoted', () => {
    it.todo('succeeds, doing nothing');
  });
});
