import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { listCreated } from '../../src/domain-events/list-created-event';
import { executeCommand } from '../../src/edit-list-details/execute-command';
import { replayListAggregate } from '../../src/shared-write-models/replay-list-aggregate';
import { arbitraryString } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';

describe('execute-command', () => {
  describe('when the new name is different from the current name', () => {
    const newName = arbitraryString();
    const listId = arbitraryListId();
    const command = {
      name: newName,
      listId,
    };

    const raisedEvents = pipe(
      [
        listCreated(listId, arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
      ],
      replayListAggregate(listId),
      E.map(executeCommand(command)),
      E.getOrElseW(shouldNotBeCalled),
    );

    it.failing('raises an event with the new name', () => {
      expect(raisedEvents).toStrictEqual([expect.objectContaining({ name: newName })]);
    });
  });

  describe('when the new name is the same as the current name', () => {
    it('raises no events', () => {
      const listName = arbitraryString();
      const command = {
        listId: arbitraryListId(),
        name: listName,
      };
      const listAggregate = {
        articleIds: [],
        name: listName,
      };
      const eventsToBeRaised = pipe(
        listAggregate,
        executeCommand(command),
      );

      expect(eventsToBeRaised).toStrictEqual([]);
    });
  });
});
