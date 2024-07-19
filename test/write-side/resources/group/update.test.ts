import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import * as groupResource from '../../../../src/write-side/resources/group';
import { arbitraryGroupJoinedEvent, arbitraryGroupDetailsUpdatedEvent } from '../../../domain-events/group-resource-events.helper';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryGroupId } from '../../../types/group-id.helper';

describe('update', () => {
  describe('when the group has joined', () => {
    const groupJoined = arbitraryGroupJoinedEvent();

    describe('when passed a new value for a single attribute', () => {
      describe.each([
        ['shortDescription'],
        ['name'],
        ['largeLogoPath'],
        ['avatarPath'],
      ])('%s', (attributeToBeChanged) => {
        const newValue = arbitraryString();

        describe('and this group\'s details have never been updated', () => {
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
              [
                groupJoined,
              ],
              groupResource.update({
                groupId: groupJoined.groupId,
                [attributeToBeChanged]: newValue,
              }),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it(`raises an event to update the group ${attributeToBeChanged}`, () => {
            expect(eventsRaised[0]).toBeDomainEvent('GroupDetailsUpdated', {
              name: undefined,
              shortDescription: undefined,
              largeLogoPath: undefined,
              avatarPath: undefined,
              descriptionPath: undefined,
              homepage: undefined,
              slug: undefined,
              groupId: groupJoined.groupId,
              [attributeToBeChanged]: newValue,
            });
          });
        });

        describe(`and this group's ${attributeToBeChanged} has previously been updated`, () => {
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
              [
                groupJoined,
                {
                  ...arbitraryGroupDetailsUpdatedEvent(),
                  groupId: groupJoined.groupId,
                  [attributeToBeChanged]: arbitraryString(),
                },
              ],
              groupResource.update({
                groupId: groupJoined.groupId,
                [attributeToBeChanged]: newValue,
              }),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it(`raises an event to update the group ${attributeToBeChanged}`, () => {
            expect(eventsRaised[0]).toBeDomainEvent('GroupDetailsUpdated', {
              name: undefined,
              shortDescription: undefined,
              largeLogoPath: undefined,
              avatarPath: undefined,
              descriptionPath: undefined,
              homepage: undefined,
              slug: undefined,
              groupId: groupJoined.groupId,
              [attributeToBeChanged]: newValue,
            });
          });
        });
      });
    });

    describe('when passed a new value for one attribute and an unchanged value for a different attribute', () => {
      describe.each([
        ['name' as const, 'largeLogoPath' as const],
        ['shortDescription' as const, 'name' as const],
        ['largeLogoPath' as const, 'shortDescription' as const],
        ['avatarPath' as const, 'shortDescription' as const],
      ])('new %s, existing %s', (attributeToBeChanged, unchangedAttribute) => {
        const newValue = arbitraryString();

        describe('and this group\'s details have never been updated', () => {
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
              [
                groupJoined,
              ],
              groupResource.update({
                groupId: groupJoined.groupId,
                [attributeToBeChanged]: newValue,
                [unchangedAttribute]: groupJoined[unchangedAttribute],
              }),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it(`raises an event to only update the group ${attributeToBeChanged}`, () => {
            expect(eventsRaised[0]).toBeDomainEvent('GroupDetailsUpdated', {
              name: undefined,
              shortDescription: undefined,
              largeLogoPath: undefined,
              avatarPath: undefined,
              descriptionPath: undefined,
              homepage: undefined,
              slug: undefined,
              groupId: groupJoined.groupId,
              [attributeToBeChanged]: newValue,
            });
          });
        });

        describe(`and this group's ${attributeToBeChanged} has previously been updated`, () => {
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
              [
                groupJoined,
                {
                  ...arbitraryGroupDetailsUpdatedEvent(),
                  groupId: groupJoined.groupId,
                  [attributeToBeChanged]: arbitraryString(),
                },
              ],
              groupResource.update({
                groupId: groupJoined.groupId,
                [attributeToBeChanged]: newValue,
                [unchangedAttribute]: groupJoined[unchangedAttribute],
              }),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it(`raises an event to only update the group ${attributeToBeChanged}`, () => {
            expect(eventsRaised[0]).toBeDomainEvent('GroupDetailsUpdated', {
              name: undefined,
              shortDescription: undefined,
              largeLogoPath: undefined,
              avatarPath: undefined,
              descriptionPath: undefined,
              homepage: undefined,
              slug: undefined,
              groupId: groupJoined.groupId,
              [attributeToBeChanged]: newValue,
            });
          });
        });
      });
    });

    describe('when passed an unchanged value for a single attribute', () => {
      describe.each([
        ['shortDescription' as const],
        ['name' as const],
        ['avatarPath' as const],
      ])('%s', (attributeToBeChanged) => {
        describe('and this group\'s details have never been updated', () => {
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
              [
                groupJoined,
              ],
              groupResource.update({
                groupId: groupJoined.groupId,
                [attributeToBeChanged]: groupJoined[attributeToBeChanged],
              }),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it('raises no events', () => {
            expect(eventsRaised).toStrictEqual([]);
          });
        });

        describe(`and this group's ${attributeToBeChanged} has previously been updated`, () => {
          const moreEventsRelatingToOurGroup = [
            {
              ...arbitraryGroupDetailsUpdatedEvent(),
              groupId: groupJoined.groupId,
              [attributeToBeChanged]: arbitraryString(),
            },
          ];
          let eventsRaised: ReadonlyArray<DomainEvent>;

          beforeEach(() => {
            eventsRaised = pipe(
              [
                groupJoined,
                ...moreEventsRelatingToOurGroup,
              ],
              groupResource.update({
                groupId: groupJoined.groupId,
                [attributeToBeChanged]: moreEventsRelatingToOurGroup[0][attributeToBeChanged],
              }),
              E.getOrElseW(shouldNotBeCalled),
            );
          });

          it('raises no events', () => {
            expect(eventsRaised).toStrictEqual([]);
          });
        });
      });
    });

    describe('when passed a value taken by another group', () => {
      describe.each([
        ['name' as const],
      ])('%s', (attributeToBeChanged) => {
        describe('and neither group\'s details have ever been updated', () => {
          const otherGroupJoined = arbitraryGroupJoinedEvent();
          const result = pipe(
            [
              groupJoined,
              otherGroupJoined,
            ],
            groupResource.update(
              {
                groupId: groupJoined.groupId,
                [attributeToBeChanged]: otherGroupJoined[attributeToBeChanged],
              },
            ),
          );

          it('returns an error', () => {
            expect(E.isLeft(result)).toBe(true);
          });
        });

        describe(`and this group's ${attributeToBeChanged} has previously been updated`, () => {
          const otherGroupJoined = arbitraryGroupJoinedEvent();
          const result = pipe(
            [
              groupJoined,
              otherGroupJoined,
              {
                ...arbitraryGroupDetailsUpdatedEvent(),
                groupId: groupJoined.groupId,
                [attributeToBeChanged]: arbitraryString(),
              },
            ],
            groupResource.update({
              groupId: groupJoined.groupId,
              [attributeToBeChanged]: otherGroupJoined[attributeToBeChanged],
            }),
          );

          it('returns an error', () => {
            expect(E.isLeft(result)).toBe(true);
          });
        });

        describe(`and the other group's ${attributeToBeChanged} has previously been updated`, () => {
          const otherGroupJoined = arbitraryGroupJoinedEvent();
          const valueTakenByOtherGroup = arbitraryString();
          const result = pipe(
            [
              groupJoined,
              otherGroupJoined,
              {
                ...arbitraryGroupDetailsUpdatedEvent(),
                groupId: otherGroupJoined.groupId,
                [attributeToBeChanged]: valueTakenByOtherGroup,
              },
            ],
            groupResource.update({
              groupId: groupJoined.groupId,
              [attributeToBeChanged]: valueTakenByOtherGroup,
            }),
          );

          it('returns an error', () => {
            expect(E.isLeft(result)).toBe(true);
          });
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
        {
          ...arbitraryGroupDetailsUpdatedEvent(),
          groupId,
        },
      ],
      groupResource.update({ groupId }),
    );

    it('returns an error', () => {
      expect(result).toStrictEqual(E.left('bad-data'));
    });
  });

  describe('when a GroupDetailsUpdated event is followed by a GroupJoined event', () => {
    const groupJoinedEvent = arbitraryGroupJoinedEvent();
    const result = pipe(
      [
        {
          ...arbitraryGroupDetailsUpdatedEvent(),
          groupId: groupJoinedEvent.groupId,
        },
        groupJoinedEvent,
      ],
      groupResource.update({ groupId: groupJoinedEvent.groupId }),
    );

    it('returns an error', () => {
      expect(result).toStrictEqual(E.left('bad-data'));
    });
  });
});
