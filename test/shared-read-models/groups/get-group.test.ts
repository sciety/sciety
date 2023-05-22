import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { constructEvent, groupJoined } from '../../../src/domain-events';
import { getGroup, handleEvent, initialState } from '../../../src/shared-read-models/groups';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryString } from '../../helpers';

const group = arbitraryGroup();

describe('getGroup', () => {
  describe('when the group has joined', () => {
    const readModel = pipe(
      [
        ...arbitraryUninterestingEvents,
        groupJoined(
          group.id,
          group.name,
          group.avatarPath,
          group.descriptionPath,
          group.shortDescription,
          group.homepage,
          group.slug,
        ),
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the group', () => {
      expect(getGroup(readModel)(group.id)).toStrictEqual(O.some(group));
    });
  });

  describe('when the group has not joined', () => {
    const readModel = pipe(
      [
        ...arbitraryUninterestingEvents,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns none', () => {
      expect(getGroup(readModel)(arbitraryGroupId())).toStrictEqual(O.none);
    });
  });

  describe('when the group has changed its name', () => {
    const newName = arbitraryString();
    const readModel = pipe(
      [
        groupJoined(
          group.id,
          group.name,
          group.avatarPath,
          group.descriptionPath,
          group.shortDescription,
          group.homepage,
          group.slug,
        ),
        constructEvent('GroupDetailsUpdated')({
          groupId: group.id,
          name: newName,
          avatarPath: undefined,
          shortDescription: undefined,
          descriptionPath: undefined,
          homepage: undefined,
          slug: undefined,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('the new name is returned', () => {
      expect(getGroup(readModel)(group.id)).toStrictEqual(O.some(expect.objectContaining({
        name: newName,
        avatarPath: group.avatarPath,
        descriptionPath: group.descriptionPath,
        shortDescription: group.shortDescription,
        homepage: group.homepage,
        slug: group.slug,
      })));
    });
  });

  describe('when the group has changed its short description', () => {
    const newShortDescription = arbitraryString();
    const readModel = pipe(
      [
        groupJoined(
          group.id,
          group.name,
          group.avatarPath,
          group.descriptionPath,
          group.shortDescription,
          group.homepage,
          group.slug,
        ),
        constructEvent('GroupDetailsUpdated')({
          groupId: group.id,
          name: undefined,
          avatarPath: undefined,
          shortDescription: newShortDescription,
          descriptionPath: undefined,
          homepage: undefined,
          slug: undefined,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.failing('the new short description is returned', () => {
      expect(getGroup(readModel)(group.id)).toStrictEqual(O.some(expect.objectContaining({
        name: group.name,
        avatarPath: group.avatarPath,
        descriptionPath: group.descriptionPath,
        shortDescription: newShortDescription,
        homepage: group.homepage,
        slug: group.slug,
      })));
    });
  });
});
