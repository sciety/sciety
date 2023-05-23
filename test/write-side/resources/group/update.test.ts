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

const arbitraryGroupDetailsUpdatedEvent = (groupId: GroupId, name?: string) => pipe(
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

    describe('when passed a new value for a single attribute', () => {
      describe.each([
        ['shortDescription'],
        ['name'],
      ])('%s', (attributeToBeChanged) => {
        const newValue = arbitraryString();

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
          const eventsRaised = executeUpdateAction({ groupId: groupJoined.groupId, [attributeToBeChanged]: newValue });

          it(`raises an event to update the group ${attributeToBeChanged}`, () => {
            expect(eventsRaised).toStrictEqual([
              expectEvent({ groupId: groupJoined.groupId, [attributeToBeChanged]: newValue }),
            ]);
          });
        });

        describe(`and they have previously updated their ${attributeToBeChanged}`, () => {
          const moreEventsRelatingToOurGroup = [
            {
              ...arbitraryGroupDetailsUpdatedEvent(groupJoined.groupId),
              [attributeToBeChanged]: arbitraryString(),
            },
          ];
          const executeUpdateAction = (command: UpdateGroupDetailsCommand) => pipe(
            [
              groupJoined,
              ...moreEventsRelatingToOurGroup,
            ],
            groupResource.update(command),
            E.getOrElseW(shouldNotBeCalled),
          );
          const eventsRaised = executeUpdateAction({ groupId: groupJoined.groupId, [attributeToBeChanged]: newValue });

          it(`raises an event to update the group ${attributeToBeChanged}`, () => {
            expect(eventsRaised).toStrictEqual([
              expectEvent({ groupId: groupJoined.groupId, [attributeToBeChanged]: newValue }),
            ]);
          });
        });
      });
    });

    describe('when passed a new value for one attribute and an unchanged value for a different attribute', () => {
      describe.each([
        ['name' as const, 'shortDescription' as const],
        ['shortDescription' as const, 'name' as const],
      ])('new %s, existing %s', (attributeToBeChanged, unchangedAttribute) => {
        const newValue = arbitraryString();

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
          const eventsRaised = executeUpdateAction({
            groupId: groupJoined.groupId,
            [attributeToBeChanged]: newValue,
            [unchangedAttribute]: groupJoined[unchangedAttribute],
          });

          it(`raises an event to only update the group ${attributeToBeChanged}`, () => {
            expect(eventsRaised).toStrictEqual([
              expectEvent({ groupId: groupJoined.groupId, [attributeToBeChanged]: newValue }),
            ]);
          });
        });

        describe(`and they have previously updated their ${attributeToBeChanged}`, () => {
          const moreEventsRelatingToOurGroup = [
            {
              ...arbitraryGroupDetailsUpdatedEvent(groupJoined.groupId),
              [attributeToBeChanged]: arbitraryString(),
            },
          ];
          const executeUpdateAction = (command: UpdateGroupDetailsCommand) => pipe(
            [
              groupJoined,
              ...moreEventsRelatingToOurGroup,
            ],
            groupResource.update(command),
            E.getOrElseW(shouldNotBeCalled),
          );
          const eventsRaised = executeUpdateAction({
            groupId: groupJoined.groupId,
            [attributeToBeChanged]: newValue,
            [unchangedAttribute]: groupJoined[unchangedAttribute],
          });

          it(`raises an event to only update the group ${attributeToBeChanged}`, () => {
            expect(eventsRaised).toStrictEqual([
              expectEvent({ groupId: groupJoined.groupId, [attributeToBeChanged]: newValue }),
            ]);
          });
        });
      });
    });

    describe('when passed an unchanged value for a single attribute', () => {
      describe.each([
        ['shortDescription' as const],
        ['name' as const],
      ])('%s', (attributeToBeChanged) => {
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
          const eventsRaised = executeUpdateAction({
            groupId: groupJoined.groupId,
            [attributeToBeChanged]: groupJoined[attributeToBeChanged],
          });

          it('raises no events', () => {
            expect(eventsRaised).toStrictEqual([]);
          });
        });

        describe(`and they have previously updated their ${attributeToBeChanged}`, () => {
          const moreEventsRelatingToOurGroup = [
            {
              ...arbitraryGroupDetailsUpdatedEvent(groupJoined.groupId),
              [attributeToBeChanged]: arbitraryString(),
            },
          ];
          const executeUpdateAction = (command: UpdateGroupDetailsCommand) => pipe(
            [
              groupJoined,
              ...moreEventsRelatingToOurGroup,
            ],
            groupResource.update(command),
            E.getOrElseW(shouldNotBeCalled),
          );
          const eventsRaised = executeUpdateAction({
            groupId: groupJoined.groupId,
            [attributeToBeChanged]: moreEventsRelatingToOurGroup[0][attributeToBeChanged],
          });

          it('raises no events', () => {
            expect(eventsRaised).toStrictEqual([]);
          });
        });
      });
    });

    describe('and they have never updated their details', () => {
      const moreEventsRelatingToOurGroup: ReadonlyArray<DomainEvent> = [];

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
