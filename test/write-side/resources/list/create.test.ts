import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { create } from '../../../../src/write-side/resources/list/create.js';
import { arbitraryString } from '../../../helpers.js';
import { arbitraryListId } from '../../../types/list-id.helper.js';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper.js';
import { constructEvent } from '../../../../src/domain-events/index.js';

describe('create', () => {
  const input = {
    listId: arbitraryListId(),
    ownerId: arbitraryListOwnerId(),
    name: arbitraryString(),
    description: arbitraryString(),
  };

  describe('when the listId in the command does not yet exist', () => {
    const result = pipe(
      [],
      create(input),
    );

    it('returns a ListCreated event', () => {
      expect(result).toStrictEqual(E.right([expect.objectContaining({
        type: 'ListCreated',
        listId: input.listId,
        ownerId: input.ownerId,
        name: input.name,
        description: input.description,
      })]));
    });
  });

  describe('when a command is received for an already existing listId', () => {
    const result = pipe(
      [
        constructEvent('ListCreated')({
          listId: input.listId,
          name: arbitraryString(),
          description: arbitraryString(),
          ownerId: arbitraryListOwnerId(),
        }),
      ],
      create(input),
    );

    it('returns no events', () => {
      expect(result).toStrictEqual(E.right([]));
    });
  });
});
