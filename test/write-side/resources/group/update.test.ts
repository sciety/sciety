/* eslint-disable jest/no-commented-out-tests */
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { UpdateGroupDetailsCommand } from '../../../../src/write-side/commands/update-group-details';
import * as groupResource from '../../../../src/write-side/resources/group';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { DomainEvent, constructEvent } from '../../../../src/domain-events';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryDescriptionPath } from '../../../types/description-path.helper';
import { GroupId } from '../../../../src/types/group-id';

const expectEvent = (fields: Record<string, unknown>) => ({
  id: expect.any(String),
  date: expect.any(Date),
  type: 'GroupDetailsUpdated',
  groupId: undefined,
  name: undefined,
  shortDescription: undefined,
  avatarPath: undefined,
  descriptionPath: undefined,
  homepage: undefined,
  slug: undefined,
  ...fields,
});

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
      const executeUpdateAction = (command: UpdateGroupDetailsCommand) => pipe(
        [
          groupJoined,
          ...moreEventsRelatingToOurGroup,
        ],
        groupResource.update(command),
        E.getOrElseW(shouldNotBeCalled),
      );

      describe('when passed a new shortDescription for the group', () => {
        const shortDescription = arbitraryString();
        const eventsRaised = executeUpdateAction({ groupId: groupJoined.groupId, shortDescription });

        it('raises an event to update the group shortDescription', () => {
          expect(eventsRaised).toStrictEqual([
            expectEvent({ groupId: groupJoined.groupId, shortDescription }),
          ]);
        });
      });

      describe('when passed the group\'s existing shortDescription', () => {
        const eventsRaised = executeUpdateAction({
          groupId: groupJoined.groupId,
          shortDescription: groupJoined.shortDescription,
        });

        it('raises no events', () => {
          expect(eventsRaised).toStrictEqual([]);
        });
      });

      describe('when passed a new name and existing shortDescription', () => {
        const name = arbitraryString();
        const eventsRaised = executeUpdateAction({
          groupId: groupJoined.groupId,
          name,
          shortDescription: groupJoined.shortDescription,
        });

        it('raises an event to only update the group name', () => {
          expect(eventsRaised).toStrictEqual([
            expectEvent({ groupId: groupJoined.groupId, name }),
          ]);
        });
      });

      describe('when passed a new name for the group', () => {
        const name = arbitraryString();
        const eventsRaised = executeUpdateAction({ groupId: groupJoined.groupId, name });

        it('raises an event to update the group name', () => {
          expect(eventsRaised).toStrictEqual([
            expectEvent({ groupId: groupJoined.groupId, name }),
          ]);
        });
      });

      describe('when passed the group\'s existing name', () => {
        const eventsRaised = executeUpdateAction({ groupId: groupJoined.groupId, name: groupJoined.name });

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

      const executeUpdateAction = (command: UpdateGroupDetailsCommand) => pipe(
        [
          groupJoined,
          ...moreEventsRelatingToOurGroup,
        ],
        groupResource.update(command),
        E.getOrElseW(shouldNotBeCalled),
      );

      describe('when passed a new name', () => {
        const name = arbitraryString();
        const eventsRaised = executeUpdateAction({ groupId: groupJoined.groupId, name });

        it('raises an event to update the group name', () => {
          expect(eventsRaised).toStrictEqual([
            expectEvent({ groupId: groupJoined.groupId, name }),
          ]);
        });
      });

      describe('when passed the group\'s current name', () => {
        const eventsRaised = executeUpdateAction({
          groupId: groupJoined.groupId,
          name: moreEventsRelatingToOurGroup[0].name,
        });

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
    const events: ReadonlyArray<DomainEvent> = [];

    describe('when passed any command', () => {
      const result = pipe(
        events,
        groupResource.update({ groupId: arbitraryGroupId() }),
      );

      it('returns an error', () => {
        expect(result).toStrictEqual(E.left('no-such-group'));
      });
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

    it('returns an error', () => {
      expect(result).toStrictEqual(E.left('bad-data'));
    });
  });
});
