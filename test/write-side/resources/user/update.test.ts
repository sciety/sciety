import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { shouldNotBeCalled } from '../../../should-not-be-called.js';
import { arbitraryUserDetails } from '../../../types/user-details.helper.js';
import { DomainEvent, constructEvent } from '../../../../src/domain-events/index.js';
import { arbitraryString, arbitraryUri } from '../../../helpers.js';
import { constructUpdateUserDetailsCommand } from '../../commands/construct-update-user-details-command.helper.js';
import { update } from '../../../../src/write-side/resources/user/index.js';
import { arbitraryUserId } from '../../../types/user-id.helper.js';

describe('update', () => {
  let events: ReadonlyArray<DomainEvent>;

  describe('when the user exists', () => {
    const originalUserDetails = arbitraryUserDetails();

    describe('and they have never updated their details', () => {
      const existingEvents = [
        constructEvent('UserCreatedAccount')({
          userId: originalUserDetails.id,
          handle: originalUserDetails.handle,
          avatarUrl: originalUserDetails.avatarUrl,
          displayName: originalUserDetails.displayName,
        }),
      ];

      describe('when passed a new avatar url', () => {
        const newAvatarUrl = arbitraryUri();
        const command = constructUpdateUserDetailsCommand({
          userId: originalUserDetails.id,
          avatarUrl: newAvatarUrl,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises an event to update avatar url', () => {
          expect(events).toStrictEqual([
            expect.objectContaining({
              userId: originalUserDetails.id,
              avatarUrl: newAvatarUrl,
              displayName: undefined,
            }),
          ]);
        });
      });

      describe('when passed a new display name', () => {
        const newDisplayName = arbitraryString();
        const command = constructUpdateUserDetailsCommand({
          userId: originalUserDetails.id,
          displayName: newDisplayName,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises an event to update display name', () => {
          expect(events).toStrictEqual([
            expect.objectContaining({
              userId: originalUserDetails.id,
              avatarUrl: undefined,
              displayName: newDisplayName,
            }),
          ]);
        });
      });

      describe('when passed a new display name and a new avatar url', () => {
        const newAvatarUrl = arbitraryUri();
        const newDisplayName = arbitraryString();
        const command = constructUpdateUserDetailsCommand({
          userId: originalUserDetails.id,
          avatarUrl: newAvatarUrl,
          displayName: newDisplayName,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises an event to update display name and avatar url', () => {
          expect(events).toStrictEqual([
            expect.objectContaining({
              userId: originalUserDetails.id,
              avatarUrl: newAvatarUrl,
              displayName: newDisplayName,
            }),
          ]);
        });
      });

      describe('when passed the existing avatar url', () => {
        const command = constructUpdateUserDetailsCommand({
          userId: originalUserDetails.id,
          avatarUrl: originalUserDetails.avatarUrl,
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
          userId: originalUserDetails.id,
          avatarUrl: undefined,
          displayName: originalUserDetails.displayName,
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
          userId: originalUserDetails.id,
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
        constructEvent('UserCreatedAccount')({
          userId: originalUserDetails.id,
          handle: originalUserDetails.handle,
          avatarUrl: originalUserDetails.avatarUrl,
          displayName: originalUserDetails.displayName,
        }),
        constructEvent('UserDetailsUpdated')({
          userId: originalUserDetails.id,
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
        }),
      ];

      describe('when passed a new avatar url', () => {
        const newAvatarUrl = arbitraryUri();
        const command = constructUpdateUserDetailsCommand({
          userId: originalUserDetails.id,
          avatarUrl: newAvatarUrl,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises an event to update avatar url', () => {
          expect(events).toStrictEqual([
            expect.objectContaining({
              userId: originalUserDetails.id,
              avatarUrl: newAvatarUrl,
              displayName: undefined,
            }),
          ]);
        });
      });

      describe('when passed a new display name', () => {
        const newDisplayName = arbitraryString();
        const command = constructUpdateUserDetailsCommand({
          userId: originalUserDetails.id,
          displayName: newDisplayName,
        });

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises an event to update display name', () => {
          expect(events).toStrictEqual([
            expect.objectContaining({
              userId: originalUserDetails.id,
              displayName: newDisplayName,
              avatarUrl: undefined,
            }),
          ]);
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
    const differentUserDetails = arbitraryUserDetails();
    const existingEvents: ReadonlyArray<DomainEvent> = [
      constructEvent('UserCreatedAccount')({
        userId: differentUserDetails.id,
        handle: differentUserDetails.handle,
        avatarUrl: differentUserDetails.avatarUrl,
        displayName: differentUserDetails.displayName,
      }),
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
