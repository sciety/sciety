import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { userCreatedAccount } from '../../../../src/domain-events/user-created-account-event';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { DomainEvent } from '../../../../src/domain-events';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { constructUpdateUserDetailsCommand } from '../../commands/construct-update-user-details-command.helper';
import { update } from '../../../../src/write-side/resources/user';

describe('update', () => {
  describe('when the user exists', () => {
    const originalUserDetails = arbitraryUserDetails();
    const existingEvents = [
      userCreatedAccount(
        originalUserDetails.id,
        originalUserDetails.handle,
        originalUserDetails.avatarUrl,
        originalUserDetails.displayName,
      ),
    ];
    let events: ReadonlyArray<DomainEvent>;

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
});
