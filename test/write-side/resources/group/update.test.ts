import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as groupResource from '../../../../src/write-side/resources/group';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { DomainEvent, constructEvent } from '../../../../src/domain-events';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryDescriptionPath } from '../../../types/description-path.helper';
import { arbitraryGroup } from '../../../types/group.helper';
import { GroupId } from '../../../../src/types/group-id';

const arbitraryGroupJoinedEvent = (groupId = arbitraryGroupId(), name = arbitraryString()) => pipe(
  {
    groupId,
    name,
    avatarPath: arbitraryUri(),
    descriptionPath: arbitraryDescriptionPath(),
    shortDescription: arbitraryString(),
    homepage: arbitraryString(),
    slug: arbitraryString(),
  },
  constructEvent('GroupJoined'),
);

const arbitraryGroupDetailsUpdatedEvent = (groupId: GroupId, name: string) => pipe(
  {
    groupId,
    name,
    avatarPath: undefined,
    descriptionPath: undefined,
    shortDescription: undefined,
    homepage: undefined,
    slug: undefined,
  },
  constructEvent('GroupDetailsUpdated'),
);

describe('update', () => {
  describe('when the group has joined', () => {
    const groupJoined = arbitraryGroupJoinedEvent();

    describe('and they have never updated their details', () => {
      const otherEvents: ReadonlyArray<DomainEvent> = [];

      describe('when passed a new name for the group', () => {
        const name = arbitraryString();
        const eventsRaised = pipe(
          [
            groupJoined,
            ...otherEvents,
          ],
          groupResource.update({ groupId: groupJoined.groupId, name }),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises an event to update the group name', () => {
          expect(eventsRaised).toStrictEqual([
            expect.objectContaining({
              type: 'GroupDetailsUpdated',
              groupId: groupJoined.groupId,
              name,
            }),
          ]);
        });
      });

      describe('when passed the group\'s existing name', () => {
        const groupId = arbitraryGroupId();
        const name = arbitraryString();
        const existingEvents = [
          arbitraryGroupJoinedEvent(groupId, name),
        ];

        const command = {
          groupId,
          name,
        };
        const events = pipe(
          groupResource.update(command)(existingEvents),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises no events', () => {
          expect(events).toStrictEqual([]);
        });
      });

      describe('when passed the name of a different existing group', () => {
        const groupToUpdate = arbitraryGroup();
        const preExistingGroup = arbitraryGroup();
        const existingEvents = [
          arbitraryGroupJoinedEvent(groupToUpdate.id, groupToUpdate.name),
          arbitraryGroupJoinedEvent(preExistingGroup.id, preExistingGroup.name),
        ];
        const command = {
          groupId: groupToUpdate.id,
          name: preExistingGroup.name,
        };
        const result = groupResource.update(command)(existingEvents);

        it('returns an error', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });
    });

    describe('and they have previously updated their details', () => {
      describe('when passed the group\'s existing name', () => {
        const groupId = arbitraryGroupId();
        const name = arbitraryString();
        const existingEvents = [
          arbitraryGroupJoinedEvent(groupId),
          arbitraryGroupDetailsUpdatedEvent(groupId, name),
        ];
        const events = pipe(
          groupResource.update({ groupId, name })(existingEvents),
          E.getOrElseW(shouldNotBeCalled),
        );

        it.failing('raises no events', () => {
          expect(events).toStrictEqual([]);
        });
      });

      describe('when passed the name of a different existing group', () => {
        it.todo('returns an error');
      });
    });
  });

  describe('when the group has not joined', () => {
    describe('when passed any command', () => {
      it.todo('fails');
    });
  });
});
