/* eslint-disable jest/no-commented-out-tests */
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as groupResource from '../../../../src/write-side/resources/group';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { DomainEvent, constructEvent } from '../../../../src/domain-events';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryDescriptionPath } from '../../../types/description-path.helper';
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
      const moreEventsRelatingToOurGroup: ReadonlyArray<DomainEvent> = [];

      describe('when passed a new name for the group', () => {
        const name = arbitraryString();
        const eventsRaised = pipe(
          [
            groupJoined,
            ...moreEventsRelatingToOurGroup,
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
        const eventsRaised = pipe(
          [
            groupJoined,
            ...moreEventsRelatingToOurGroup,
          ],
          groupResource.update({ groupId: groupJoined.groupId, name: groupJoined.name }),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises no events', () => {
          expect(eventsRaised).toStrictEqual([]);
        });
      });

      describe('when passed the name of another existing group', () => {
        const otherGroupJoined = arbitraryGroupJoinedEvent();
        const result = pipe(
          [
            groupJoined,
            otherGroupJoined,
            ...moreEventsRelatingToOurGroup,
          ],
          groupResource.update({ groupId: groupJoined.groupId, name: otherGroupJoined.name }),
        );

        it('returns an error', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });
    });

    describe('and they have previously updated their details', () => {
      const moreEventsRelatingToOurGroup = [
        arbitraryGroupDetailsUpdatedEvent(groupJoined.groupId, arbitraryString()),
      ];

      describe('when passed the group\'s current name', () => {
        const eventsRaised = pipe(
          [
            groupJoined,
            ...moreEventsRelatingToOurGroup,
          ],
          groupResource.update({ groupId: groupJoined.groupId, name: moreEventsRelatingToOurGroup[0].name }),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises no events', () => {
          expect(eventsRaised).toStrictEqual([]);
        });
      });

      describe('when passed the name of another existing group', () => {
        const otherGroupJoined = arbitraryGroupJoinedEvent();
        const result = pipe(
          [
            groupJoined,
            otherGroupJoined,
            ...moreEventsRelatingToOurGroup,
          ],
          groupResource.update({ groupId: groupJoined.groupId, name: otherGroupJoined.name }),
        );

        it('returns an error', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });
    });
  });

  describe('when the group has not joined', () => {
    describe('when passed any command', () => {
      it.todo('fails');
    });
  });

  describe('when a GroupDetailsUpdated event exists without a previous GroupJoined event', () => {
    const groupId = arbitraryGroupId();
    const result = pipe(
      [
        arbitraryGroupDetailsUpdatedEvent(groupId, arbitraryString()),
      ],
      groupResource.update({ groupId }),
    );

    it('returns an error', () => {
      expect(result).toStrictEqual(E.left('bad-data'));
    });
  });

  describe('when a GroupDetailsUpdated event is followed by a GroupJoined event', () => {
    const groupId = arbitraryGroupId();
    const result = pipe(
      [
        arbitraryGroupDetailsUpdatedEvent(groupId, arbitraryString()),
        arbitraryGroupJoinedEvent(groupId),
      ],
      groupResource.update({ groupId }),
    );

    it.failing('returns an error', () => {
      expect(result).toStrictEqual(E.left('bad-data'));
    });
  });
});
