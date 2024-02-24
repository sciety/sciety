import * as RA from 'fp-ts/ReadonlyArray';
import { constructEvent } from '../../../src/domain-events/index.js';
import { handleEvent, initialState } from '../../../src/read-models/groups/handle-event.js';
import { arbitraryGroup } from '../../types/group.helper.js';
import { getAllGroups } from '../../../src/read-models/groups/get-all-groups.js';

describe('get-all-groups', () => {
  const group1 = arbitraryGroup();
  const group2 = arbitraryGroup();
  const group3 = arbitraryGroup();
  const events = [
    constructEvent('GroupJoined')({
      groupId: group2.id,
      name: group2.name,
      avatarPath: group2.avatarPath,
      descriptionPath: group2.descriptionPath,
      shortDescription: group2.shortDescription,
      homepage: group2.homepage,
      slug: group2.slug,
    }),
    constructEvent('GroupJoined')({
      groupId: group3.id,
      name: group3.name,
      avatarPath: group3.avatarPath,
      descriptionPath: group3.descriptionPath,
      shortDescription: group3.shortDescription,
      homepage: group3.homepage,
      slug: group3.slug,
    }),
  ];

  it('returns all groups in arbitrary order', () => {
    let groupsReadModelInstance = RA.reduce(initialState(), handleEvent)(events);
    const query = getAllGroups(groupsReadModelInstance);
    groupsReadModelInstance = RA.reduce(groupsReadModelInstance, handleEvent)([constructEvent('GroupJoined')({
      groupId: group1.id,
      name: group1.name,
      avatarPath: group1.avatarPath,
      descriptionPath: group1.descriptionPath,
      shortDescription: group1.shortDescription,
      homepage: group1.homepage,
      slug: group1.slug,
    })]);

    const allGroups = query();

    expect(allGroups).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: group1.name }),
        expect.objectContaining({ name: group2.name }),
        expect.objectContaining({ name: group3.name }),
      ]),
    );
  });
});
