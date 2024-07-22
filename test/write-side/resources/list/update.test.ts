import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events';
import { executeCommand } from '../../../../src/write-side/resources/list/execute-command';
import { getListWriteModel } from '../../../../src/write-side/resources/list/get-list-write-model';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';
import { arbitrarySanitisedUserInput } from '../../../types/sanitised-user-input.helper';

describe('update', () => {
  const listId = arbitraryListId();
  const listName = arbitrarySanitisedUserInput();
  const listDescription = arbitrarySanitisedUserInput();

  describe('when the list exists', () => {
    describe('when the new name is different from the current name', () => {
      const newName = arbitrarySanitisedUserInput();
      const command = {
        name: newName,
        description: listDescription,
        listId,
      };

      const raisedEvents = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: arbitraryString(),
            description: listDescription,
            ownerId: arbitraryListOwnerId(),
          }),
        ],
        getListWriteModel(listId),
        E.map(executeCommand(command)),
        E.getOrElseW(shouldNotBeCalled),
      );

      it('raises exactly one event', () => {
        expect(raisedEvents).toHaveLength(1);
      });

      it('raises an event with the new name', () => {
        expect(raisedEvents[0]).toBeDomainEvent('ListNameEdited', {
          name: newName,
        });
      });
    });

    describe('when the new description is different from the current description', () => {
      const newDescription = arbitrarySanitisedUserInput();
      const command = {
        name: listName,
        description: newDescription,
        listId,
      };

      const raisedEvents = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: listName,
            description: arbitraryString(),
            ownerId: arbitraryListOwnerId(),
          }),
        ],
        getListWriteModel(listId),
        E.map(executeCommand(command)),
        E.getOrElseW(shouldNotBeCalled),
      );

      it('raises exactly one event', () => {
        expect(raisedEvents).toHaveLength(1);
      });

      it('raises an event with the new description', () => {
        expect(raisedEvents[0]).toBeDomainEvent('ListDescriptionEdited', {
          description: newDescription,
        });
      });
    });

    describe('when the new name and description are the same as the current details', () => {
      it('raises no events', () => {
        const command = {
          name: listName,
          description: listDescription,
          listId,
        };
        const eventsToBeRaised = pipe(
          [
            constructEvent('ListCreated')({
              listId,
              name: listName,
              description: listDescription,
              ownerId: arbitraryListOwnerId(),
            }),
          ],
          getListWriteModel(listId),
          E.map(executeCommand(command)),
          E.getOrElseW(shouldNotBeCalled),
        );

        expect(eventsToBeRaised).toStrictEqual([]);
      });
    });

    describe('when both name and description are different from the current details', () => {
      const newName = arbitrarySanitisedUserInput();
      const newDescription = arbitrarySanitisedUserInput();
      const command = {
        name: newName,
        description: newDescription,
        listId,
      };

      const raisedEvents = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: arbitraryString(),
            description: arbitraryString(),
            ownerId: arbitraryListOwnerId(),
          }),
        ],
        getListWriteModel(listId),
        E.map(executeCommand(command)),
        E.getOrElseW(shouldNotBeCalled),
      );

      it('raises exactly two events', () => {
        expect(raisedEvents).toHaveLength(2);
      });

      it('raises two events with the new details', () => {
        expect(raisedEvents[0]).toBeDomainEvent('ListNameEdited', {
          name: newName,
        });
        expect(raisedEvents[1]).toBeDomainEvent('ListDescriptionEdited', {
          description: newDescription,
        });
      });
    });
  });
});
