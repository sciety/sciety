import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { update } from '../../../../src/write-side/resources/group';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryString } from '../../../helpers';
import { DomainEvent, groupJoined } from '../../../../src/domain-events';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryDescriptionPath } from '../../../types/description-path.helper';

describe('update', () => {
  describe('when the group has joined', () => {
    describe('and they have never updated their details', () => {
      const groupId = arbitraryGroupId();
      const name = arbitraryString();
      const existingEvents = [
        groupJoined(
          groupId,
          name,
          arbitraryString(),
          arbitraryDescriptionPath(),
          arbitraryString(),
          arbitraryString(),
          arbitraryString(),
        ),
      ];

      describe('when passed a new name for the group', () => {
        const newName = arbitraryString();
        const command = {
          groupId,
          name: newName,
        };
        let events: ReadonlyArray<DomainEvent>;

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('raises an event to update the group name', () => {
          expect(events).toStrictEqual([
            expect.objectContaining({
              groupId,
              name: newName,
            }),
          ]);
        });
      });

      describe('when passed the group\'s existing name', () => {
        const command = {
          groupId,
          name,
        };
        let events: ReadonlyArray<DomainEvent>;

        beforeEach(() => {
          events = pipe(
            update(command)(existingEvents),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it.failing('raises no events', () => {
          expect(events).toStrictEqual([]);
        });
      });
    });

    describe('and they have previously updated their details', () => {
      describe('when passed a new name for the group', () => {
        it.todo('raises an event to update the group name');
      });

      describe('when passed the group\'s existing name', () => {
        it.todo('raises no events');
      });
    });
  });

  describe('when the group has not joined', () => {
    describe('when passed any command', () => {
      it.todo('fails');
    });
  });
});
