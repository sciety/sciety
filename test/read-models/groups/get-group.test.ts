import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events/index.js';
import { handleEvent, initialState } from '../../../src/read-models/groups/handle-event.js';
import { arbitraryGroupId } from '../../types/group-id.helper.js';
import { arbitraryGroup } from '../../types/group.helper.js';
import { arbitraryString } from '../../helpers.js';
import { getGroup } from '../../../src/read-models/groups/get-group.js';

const group = arbitraryGroup();

describe('getGroup', () => {
  describe('when the group has joined', () => {
    const readModel = pipe(
      [
        constructEvent('GroupJoined')({
          groupId: group.id,
          ...group,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the group', () => {
      expect(getGroup(readModel)(group.id)).toStrictEqual(O.some(group));
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
    const newName = arbitraryString();
    const readModel = pipe(
      [
        constructEvent('GroupJoined')({
          groupId: group.id,
          ...group,
        }),
        constructEvent('GroupDetailsUpdated')({
          groupId: group.id,
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

    it('the new name is returned', () => {
      expect(getGroup(readModel)(group.id)).toStrictEqual(O.some(expect.objectContaining({
        name: newName,
        avatarPath: group.avatarPath,
        descriptionPath: group.descriptionPath,
        shortDescription: group.shortDescription,
        homepage: group.homepage,
        slug: group.slug,
        largeLogoPath: group.largeLogoPath,
      })));
    });
  });

  describe('when the group has changed its short description', () => {
    const newShortDescription = arbitraryString();
    const readModel = pipe(
      [
        constructEvent('GroupJoined')({
          groupId: group.id,
          ...group,
        }),
        constructEvent('GroupDetailsUpdated')({
          groupId: group.id,
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
      expect(getGroup(readModel)(group.id)).toStrictEqual(O.some(expect.objectContaining({
        name: group.name,
        avatarPath: group.avatarPath,
        descriptionPath: group.descriptionPath,
        shortDescription: newShortDescription,
        homepage: group.homepage,
        slug: group.slug,
        largeLogoPath: group.largeLogoPath,
      })));
    });
  });

  describe('when the group has provided a large logo', () => {
    const largeLogoPath = arbitraryString();
    const readModel = pipe(
      [
        constructEvent('GroupJoined')({
          groupId: group.id,
          ...group,
        }),
        constructEvent('GroupDetailsUpdated')({
          groupId: group.id,
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
      expect(getGroup(readModel)(group.id)).toStrictEqual(O.some(expect.objectContaining({
        largeLogoPath: O.some(largeLogoPath),
      })));
    });
  });
});
