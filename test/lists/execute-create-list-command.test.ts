import { pipe } from 'fp-ts/function';
import { isListCreatedEvent } from '../../src/domain-events/list-created-event';
import { executeCreateListCommand } from '../../src/lists/execute-create-list-command';
import { arbitraryString } from '../helpers';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';

describe('execute-create-list-command', () => {
  describe('when a command is received', () => {
    const listId = arbitraryListId();
    const ownerId = arbitraryListOwnerId();
    const name = arbitraryString();
    const description = arbitraryString();
    const result = pipe(
      {
        listId,
        ownerId,
        name,
        description,
      },
      executeCreateListCommand,
    );

    it('returns a ListCreated event', () => {
      expect(result).toHaveLength(1);
      expect(isListCreatedEvent(result[0])).toBe(true);
    });

    it('returns a ListCreated event with the specified listId', () => {
      expect(result[0].listId).toStrictEqual(listId);
    });

    it('returns a ListCreated event containing the requested owner', () => {
      expect(result[0].ownerId).toStrictEqual(ownerId);
    });

    it('returns a ListCreated event containing the requested name', () => {
      expect(result[0].name).toStrictEqual(name);
    });

    it('returns a ListCreated event containing the requested description', () => {
      expect(result[0].description).toStrictEqual(description);
    });
  });
});
