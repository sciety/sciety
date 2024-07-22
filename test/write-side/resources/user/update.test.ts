import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import { update } from '../../../../src/write-side/resources/user';
import { arbitraryUserCreatedAccountEvent, arbitraryUserDetailsUpdatedEvent } from '../../../domain-events/user-resource-events.helper';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { constructUpdateUserDetailsCommand } from '../../commands/construct-update-user-details-command.helper';

describe('update', () => {
  let events: ReadonlyArray<DomainEvent>;

  describe('when the user exists', () => {
    const userCreatedAccountEvent = arbitraryUserCreatedAccountEvent();

    describe('and they have never updated their details', () => {
      const existingEvents = [
        userCreatedAccountEvent,
      ];

      describe('when passed a new display name', () => {
        const newDisplayName = arbitraryString();
        const command = constructUpdateUserDetailsCommand({
          userId: userCreatedAccountEvent.userId,
          displayName: newDisplayName,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('causes a state change in which the user\'s display name is updated', () => {
          expect(events).toHaveLength(1);
          expect(events[0]).toBeDomainEvent('UserDetailsUpdated', {
            userId: userCreatedAccountEvent.userId,
            displayName: newDisplayName,
            avatarUrl: undefined,
          });
        });
      });

      describe('when passed the existing display name', () => {
        const command = {
          userId: userCreatedAccountEvent.userId,
          displayName: userCreatedAccountEvent.displayName,
        };

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('accepts the command and causes no state change', () => {
          expect(events).toStrictEqual([]);
        });
      });

      describe('when passed no displayName', () => {
        const command = {
          userId: userCreatedAccountEvent.userId,
          displayName: undefined,
        };

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('accepts the command and causes no state change', () => {
          expect(events).toStrictEqual([]);
        });
      });
    });

    describe('and they have previously updated their details', () => {
      const existingEvents = [
        userCreatedAccountEvent,
        {
          ...arbitraryUserDetailsUpdatedEvent(),
          userId: userCreatedAccountEvent.userId,
        },
      ];

      describe('when passed a new display name', () => {
        const newDisplayName = arbitraryString();
        const command = constructUpdateUserDetailsCommand({
          userId: userCreatedAccountEvent.userId,
          displayName: newDisplayName,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('causes a state change in which the user\'s display name is updated', () => {
          expect(events).toHaveLength(1);
          expect(events[0]).toBeDomainEvent('UserDetailsUpdated', {
            userId: userCreatedAccountEvent.userId,
            displayName: newDisplayName,
            avatarUrl: undefined,
          });
        });
      });
    });
  });

  describe('when no users exist', () => {
    const existingEvents: ReadonlyArray<DomainEvent> = [];

    describe('when passed any command', () => {
      const command = constructUpdateUserDetailsCommand({
        userId: arbitraryUserId(),
        displayName: arbitraryString(),
      });
      let result: E.Either<unknown, unknown>;

      beforeEach(() => {
        result = pipe(
          update(command)(existingEvents),
        );
      });

      it('rejects the command', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });

  describe('when a different user exists', () => {
    const existingEvents: ReadonlyArray<DomainEvent> = [
      arbitraryUserCreatedAccountEvent(),
    ];

    describe('when passed any command', () => {
      const command = constructUpdateUserDetailsCommand({
        userId: arbitraryUserId(),
        displayName: arbitraryString(),
      });
      let result: E.Either<unknown, unknown>;

      beforeEach(() => {
        result = pipe(
          update(command)(existingEvents),
        );
      });

      it('rejects the command', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });
});
