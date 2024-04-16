import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { getGroup } from '../../../src/read-models/groups/get-group';
import { handleEvent, initialState } from '../../../src/read-models/groups/handle-event';
import { Group } from '../../../src/types/group';
import {
  arbitraryGroupDetailsUpdatedEvent,
  arbitraryGroupJoinedEvent,
} from '../../domain-events/group-resource-events.helper';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';

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
      expect(foundGroup.largeLogoPath).toStrictEqual(O.fromNullable(groupJoinedEvent.largeLogoPath));
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
    const groupJoinedEvent = arbitraryGroupJoinedEvent();
    const groupId = groupJoinedEvent.groupId;
    const newName = arbitraryString();
    const readModel = pipe(
      [
        groupJoinedEvent,
        {
          ...arbitraryGroupDetailsUpdatedEvent(),
          groupId,
          name: newName,
        },
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

    it('returns the group\'s id', () => {
      expect(result.id).toStrictEqual(groupJoinedEvent.groupId);
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
    const groupJoinedEvent = arbitraryGroupJoinedEvent();
    const groupId = groupJoinedEvent.groupId;
    const newShortDescription = arbitraryString();
    const readModel = pipe(
      [
        groupJoinedEvent,
        {
          ...arbitraryGroupDetailsUpdatedEvent(),
          groupId,
          shortDescription: newShortDescription,
        },
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

    it('returns the group\'s id', () => {
      expect(result.id).toStrictEqual(groupJoinedEvent.groupId);
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
    const groupJoinedEvent = arbitraryGroupJoinedEvent();
    const groupId = groupJoinedEvent.groupId;
    const newLargeLogoPath = arbitraryString();
    const readModel = pipe(
      [
        groupJoinedEvent,
        {
          ...arbitraryGroupDetailsUpdatedEvent(),
          groupId,
          largeLogoPath: newLargeLogoPath,
        },
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

    it('returns the group\'s id', () => {
      expect(result.id).toStrictEqual(groupJoinedEvent.groupId);
    });

    it('returns the group\'s largeLogoPath changed', () => {
      expect(result.largeLogoPath).toStrictEqual(O.fromNullable(newLargeLogoPath));
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
