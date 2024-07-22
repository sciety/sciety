import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../../src/domain-events';
import { update } from '../../../../src/write-side/resources/list';
import { arbitraryListCreatedEvent, arbitraryListDeletedEvent } from '../../../domain-events/list-resource-events.helper';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';
import { arbitrarySanitisedUserInput } from '../../../types/sanitised-user-input.helper';
import { arbitraryEditListDetailsCommand } from '../../commands/edit-list-details-command.helper';

describe('update', () => {
  const listId = arbitraryListId();
  const listName = arbitrarySanitisedUserInput();
  const listDescription = arbitrarySanitisedUserInput();

  describe('when the list exists', () => {
    let raisedEvents: ReadonlyArray<DomainEvent>;

    describe('when the new name is different from the current name', () => {
      const newName = arbitrarySanitisedUserInput();
      const command = {
        name: newName,
        description: listDescription,
        listId,
      };

      beforeEach(() => {
        raisedEvents = pipe(
          [
            constructEvent('ListCreated')({
              listId,
              name: arbitraryString(),
              description: listDescription,
              ownerId: arbitraryListOwnerId(),
            }),
          ],
          update(command),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change updating the list name', () => {
        expect(raisedEvents).toHaveLength(1);
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

      beforeEach(() => {
        raisedEvents = pipe(
          [
            constructEvent('ListCreated')({
              listId,
              name: listName,
              description: arbitraryString(),
              ownerId: arbitraryListOwnerId(),
            }),
          ],
          update(command),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change updating the list description', () => {
        expect(raisedEvents).toHaveLength(1);
        expect(raisedEvents[0]).toBeDomainEvent('ListDescriptionEdited', {
          description: newDescription,
        });
      });
    });

    describe('when the new name and description are the same as the current details', () => {
      const command = {
        name: listName,
        description: listDescription,
        listId,
      };

      beforeEach(() => {
        raisedEvents = pipe(
          [
            constructEvent('ListCreated')({
              listId,
              name: listName,
              description: listDescription,
              ownerId: arbitraryListOwnerId(),
            }),
          ],
          update(command),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('accepts the command and causes no state change', () => {
        expect(raisedEvents).toStrictEqual([]);
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

      beforeEach(() => {
        raisedEvents = pipe(
          [
            constructEvent('ListCreated')({
              listId,
              name: arbitraryString(),
              description: arbitraryString(),
              ownerId: arbitraryListOwnerId(),
            }),
          ],
          update(command),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change updating both list name and description', () => {
        expect(raisedEvents).toHaveLength(2);
        expect(raisedEvents[0]).toBeDomainEvent('ListNameEdited', {
          name: newName,
        });
        expect(raisedEvents[1]).toBeDomainEvent('ListDescriptionEdited', {
          description: newDescription,
        });
      });
    });
  });

  describe('when the list never existed', () => {
    const command = arbitraryEditListDetailsCommand();
    const result = pipe(
      [],
      update(command),
    );

    it('rejects the command with "list-not-found"', () => {
      expect(result).toStrictEqual(E.left('list-not-found'));
    });
  });

  describe('when the list existed and was later deleted', () => {
    const result = pipe(
      [
        {
          ...arbitraryListCreatedEvent(),
          listId,
        },
        {
          ...arbitraryListDeletedEvent(),
          listId,
        },
      ],
      update({
        ...arbitraryEditListDetailsCommand(),
        listId,
      }),
    );

    it('rejects the command with "list-not-found"', () => {
      expect(result).toStrictEqual(E.left('list-not-found'));
    });
  });
});
