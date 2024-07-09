import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { create } from '../../../../src/write-side/resources/list/create';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';

describe('create', () => {
  const input = {
    listId: arbitraryListId(),
    ownerId: arbitraryListOwnerId(),
    name: arbitraryString(),
    description: arbitraryString(),
  };

  describe('given a command', () => {
    const result = pipe(
      [],
      create(input),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises exactly one event', () => {
      expect(result).toHaveLength(1);
    });

    it('returns a ListCreated event', () => {
      expect(result[0]).toBeDomainEvent('ListCreated', {
        listId: input.listId,
        ownerId: input.ownerId,
        name: input.name,
        description: input.description,
      });
    });
  });
});
