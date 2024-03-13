import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/groups/handle-event';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryString } from '../../helpers';
import { getGroup } from '../../../src/read-models/groups/get-group';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { Group } from '../../../src/types/group';
import { shouldNotBeCalled } from '../../should-not-be-called';

const group = arbitraryGroup();

describe('getGroup', () => {
  describe('when the group has joined', () => {
    let foundGroup: Group;

    beforeEach(() => {
      const readModel = pipe(
        [
          arbitraryGroupJoinedEvent(group.id),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      foundGroup = pipe(
        group.id,
        getGroup(readModel),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns the requested group', () => {
      expect(foundGroup.id).toStrictEqual(group.id);
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

    it('returns the requested group with only the name changed', () => {
      expect(getGroup(readModel)(groupId)).toStrictEqual(O.some(expect.objectContaining({
        name: newName,
        avatarPath: groupJoinedEvent.avatarPath,
        descriptionPath: groupJoinedEvent.descriptionPath,
        shortDescription: groupJoinedEvent.shortDescription,
        homepage: groupJoinedEvent.homepage,
        slug: groupJoinedEvent.slug,
        largeLogoPath: O.none,
      })));
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

    it('the new short description is returned', () => {
      expect(getGroup(readModel)(groupId)).toStrictEqual(O.some(expect.objectContaining({
        name: groupJoinedEvent.name,
        avatarPath: groupJoinedEvent.avatarPath,
        descriptionPath: groupJoinedEvent.descriptionPath,
        shortDescription: newShortDescription,
        homepage: groupJoinedEvent.homepage,
        slug: groupJoinedEvent.slug,
        largeLogoPath: O.none,
      })));
    });
  });

  describe('when the group has provided a large logo', () => {
    const groupId = arbitraryGroupId();
    const groupJoinedEvent = arbitraryGroupJoinedEvent(groupId);
    const largeLogoPath = arbitraryString();
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
          largeLogoPath,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('the large logo path is returned', () => {
      expect(getGroup(readModel)(groupId)).toStrictEqual(O.some(expect.objectContaining({
        largeLogoPath: O.some(largeLogoPath),
      })));
    });
  });
});
