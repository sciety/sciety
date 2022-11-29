import { pipe } from 'fp-ts/function';
import { executeCommand } from '../../src/edit-list-details/execute-command';
import { arbitraryString } from '../helpers';
import { arbitraryListId } from '../types/list-id.helper';

describe('execute-command', () => {
  describe('when the new name is different from the current name', () => {
    it.todo('raises an event with the new name');
  });

  describe('when the new name is the same as the current name', () => {
    it('raises no events', () => {
      const command = {
        listId: arbitraryListId(),
        name: arbitraryString(),
      };
      const listAggregate = {
        articleIds: [],
      };
      const eventsToBeRaised = pipe(
        listAggregate,
        executeCommand(command),
      );

      expect(eventsToBeRaised).toStrictEqual([]);
    });
  });
});
