import { pipe } from 'fp-ts/function';
import { isListCreatedEvent } from '../../src/domain-events/list-created-event';
import { executeCreateListCommand } from '../../src/lists';
import { arbitraryString } from '../helpers';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';

describe('index', () => {
  describe('when a command is received', () => {
    const result = pipe(
      {
        ownerId: arbitraryListOwnerId(),
        name: arbitraryString(),
        description: arbitraryString(),
      },
      executeCreateListCommand,
    );

    it('returns a ListCreated event', () => {
      expect(result).toHaveLength(1);
      expect(isListCreatedEvent(result[0])).toBe(true);
    });

    it.todo('returns a ListCreated event containing the requested owner');

    it.todo('returns a ListCreated event containing the requested name');

    it.todo('returns a ListCreated event containing the requested description');
  });
});
