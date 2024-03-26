import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { DomainEvent } from '../../../../src/domain-events';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { constructUpdateUserDetailsCommand } from '../../commands/construct-update-user-details-command.helper';
import { update } from '../../../../src/write-side/resources/user';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { arbitraryUserCreatedAccountEvent, arbitraryUserDetailsUpdatedEvent } from '../../../domain-events/user-resource-events.helper';

describe('update', () => {
  let events: ReadonlyArray<DomainEvent>;

  describe('when the user exists', () => {
    const userCreatedAccountEvent = arbitraryUserCreatedAccountEvent();

    describe('and they have never updated their details', () => {
      const existingEvents = [
        userCreatedAccountEvent,
      ];

      describe('when passed a new avatar url', () => {
        const newAvatarUrl = arbitraryUri();
        const command = constructUpdateUserDetailsCommand({
          userId: userCreatedAccountEvent.userId,
          avatarUrl: newAvatarUrl,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises exactly one event', () => {
          expect(events).toHaveLength(1);
        });

        it('raises an event to update avatar url', () => {
          expect(events[0]).toBeDomainEvent('UserDetailsUpdated', {
            userId: userCreatedAccountEvent.userId,
            avatarUrl: newAvatarUrl,
            displayName: undefined,
          });
        });
      });

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

        it('raises exactly one event', () => {
          expect(events).toHaveLength(1);
        });

        it('raises an event to update display name', () => {
          expect(events[0]).toBeDomainEvent('UserDetailsUpdated', {
            userId: userCreatedAccountEvent.userId,
            avatarUrl: undefined,
            displayName: newDisplayName,
          });
        });
      });

      describe('when passed a new display name and a new avatar url', () => {
        const newAvatarUrl = arbitraryUri();
        const newDisplayName = arbitraryString();
        const command = constructUpdateUserDetailsCommand({
          userId: userCreatedAccountEvent.userId,
          avatarUrl: newAvatarUrl,
          displayName: newDisplayName,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises exactly one event', () => {
          expect(events).toHaveLength(1);
        });

        it('raises an event to update display name and avatar url', () => {
          expect(events[0]).toBeDomainEvent('UserDetailsUpdated', {
            userId: userCreatedAccountEvent.userId,
            avatarUrl: newAvatarUrl,
            displayName: newDisplayName,
          });
        });
      });

      describe('when passed the existing avatar url', () => {
        const command = constructUpdateUserDetailsCommand({
          userId: userCreatedAccountEvent.userId,
          avatarUrl: userCreatedAccountEvent.avatarUrl,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises no events', () => {
          expect(events).toStrictEqual([]);
        });
      });

      describe('when passed the existing display name', () => {
        const command = {
          userId: userCreatedAccountEvent.userId,
          avatarUrl: undefined,
          displayName: userCreatedAccountEvent.displayName,
        };

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises no events', () => {
          expect(events).toStrictEqual([]);
        });
      });

      describe('when passed no avatarUrl and no displayName', () => {
        const command = {
          userId: userCreatedAccountEvent.userId,
          avatarUrl: undefined,
          displayName: undefined,
        };

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises no events', () => {
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

      describe('when passed a new avatar url', () => {
        const newAvatarUrl = arbitraryUri();
        const command = constructUpdateUserDetailsCommand({
          userId: userCreatedAccountEvent.userId,
          avatarUrl: newAvatarUrl,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises exactly one event', () => {
          expect(events).toHaveLength(1);
        });

        it('raises an event to update avatar url', () => {
          expect(events[0]).toBeDomainEvent('UserDetailsUpdated', {
            userId: userCreatedAccountEvent.userId,
            avatarUrl: newAvatarUrl,
            displayName: undefined,
          });
        });
      });

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

        it('raises exactly one event', () => {
          expect(events).toHaveLength(1);
        });

        it('raises an event to update display name', () => {
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
        avatarUrl: arbitraryUri(),
      });
      let result: E.Either<unknown, unknown>;

      beforeEach(() => {
        result = pipe(
          update(command)(existingEvents),
        );
      });

      it('fails', () => {
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
        avatarUrl: arbitraryUri(),
      });
      let result: E.Either<unknown, unknown>;

      beforeEach(() => {
        result = pipe(
          update(command)(existingEvents),
        );
      });

      it('fails', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });
});
