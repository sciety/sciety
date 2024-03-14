import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/groups/handle-event';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryString } from '../../helpers';
import { getGroup } from '../../../src/read-models/groups/get-group';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { Group } from '../../../src/types/group';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('getGroup', () => {
  describe('when the group has joined', () => {
    const groupJoinedEvent = arbitraryGroupJoinedEvent();
    let foundGroup: Group;

    beforeEach(() => {
      const readModel = pipe(
        [
          groupJoinedEvent,
        ],
        RA.reduce(initialState(), handleEvent),
      );

      foundGroup = pipe(
        groupJoinedEvent.groupId,
        getGroup(readModel),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns the requested group\'s id', () => {
      expect(foundGroup.id).toStrictEqual(groupJoinedEvent.groupId);
    });

    it('returns the requested group\'s large logo', () => {
      expect(foundGroup.largeLogoPath).toStrictEqual(O.some(groupJoinedEvent.largeLogoPath));
    });

    it.each([
      ['name' as const],
      ['avatarPath' as const],
      ['descriptionPath' as const],
      ['shortDescription' as const],
      ['homepage' as const],
      ['slug' as const],
    ])('returns the requested group\'s %s', (property) => {
      expect(foundGroup[property]).toStrictEqual(groupJoinedEvent[property]);
    });
  });

  describe('when the group has not joined', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns none', () => {
      expect(getGroup(readModel)(arbitraryGroupId())).toStrictEqual(O.none);
    });
  });

  describe('when the group has changed its name', () => {
    const groupId = arbitraryGroupId();
    const groupJoinedEvent = arbitraryGroupJoinedEvent(groupId);
    const newName = arbitraryString();
    const readModel = pipe(
      [
        groupJoinedEvent,
        constructEvent('GroupDetailsUpdated')({
          groupId,
          name: newName,
          avatarPath: undefined,
          shortDescription: undefined,
          descriptionPath: undefined,
          largeLogoPath: undefined,
          homepage: undefined,
          slug: undefined,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    let result: Group;

    beforeEach(() => {
      result = pipe(
        groupId,
        getGroup(readModel),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns the group\'s name changed', () => {
      expect(result.name).toBe(newName);
    });

    it('returns the group\'s largeLogoPath unchanged', () => {
      expect(result.largeLogoPath).toStrictEqual(O.fromNullable(groupJoinedEvent.largeLogoPath));
    });

    it.each([
      ['avatarPath' as const],
      ['descriptionPath' as const],
      ['shortDescription' as const],
      ['homepage' as const],
      ['slug' as const],
    ])('returns the group\'s %s unchanged', (property) => {
      expect(result[property]).toStrictEqual(groupJoinedEvent[property]);
    });
  });

  describe('when the group has changed its short description', () => {
    const groupId = arbitraryGroupId();
    const groupJoinedEvent = arbitraryGroupJoinedEvent(groupId);
    const newShortDescription = arbitraryString();
    const readModel = pipe(
      [
        groupJoinedEvent,
        constructEvent('GroupDetailsUpdated')({
          groupId,
          name: undefined,
          avatarPath: undefined,
          shortDescription: newShortDescription,
          descriptionPath: undefined,
          largeLogoPath: undefined,
          homepage: undefined,
          slug: undefined,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    let result: Group;

    beforeEach(() => {
      result = pipe(
        groupId,
        getGroup(readModel),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns the group\'s shortDescription changed', () => {
      expect(result.shortDescription).toBe(newShortDescription);
    });

    it('returns the group\'s largeLogoPath unchanged', () => {
      expect(result.largeLogoPath).toStrictEqual(O.fromNullable(groupJoinedEvent.largeLogoPath));
    });

    it.each([
      ['name' as const],
      ['avatarPath' as const],
      ['descriptionPath' as const],
      ['homepage' as const],
      ['slug' as const],
    ])('returns the group\'s %s unchanged', (property) => {
      expect(result[property]).toStrictEqual(groupJoinedEvent[property]);
    });
  });

  describe('when the group has changed its large logo', () => {
    const groupId = arbitraryGroupId();
    const groupJoinedEvent = arbitraryGroupJoinedEvent(groupId);
    const newLargeLogoPath = arbitraryString();
    const readModel = pipe(
      [
        groupJoinedEvent,
        constructEvent('GroupDetailsUpdated')({
          groupId,
          name: undefined,
          avatarPath: undefined,
          shortDescription: undefined,
          descriptionPath: undefined,
          homepage: undefined,
          slug: undefined,
          largeLogoPath: newLargeLogoPath,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    let result: Group;

    beforeEach(() => {
      result = pipe(
        groupId,
        getGroup(readModel),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns the group\'s largeLogoPath changed', () => {
      expect(result.largeLogoPath).toStrictEqual(O.some(newLargeLogoPath));
    });

    it.each([
      ['name' as const],
      ['avatarPath' as const],
      ['descriptionPath' as const],
      ['shortDescription' as const],
      ['homepage' as const],
      ['slug' as const],
    ])('returns the group\'s %s unchanged', (property) => {
      expect(result[property]).toStrictEqual(groupJoinedEvent[property]);
    });
  });
});
