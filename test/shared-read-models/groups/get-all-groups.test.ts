import * as RA from 'fp-ts/ReadonlyArray';
import { groupJoined } from '../../../src/domain-events';
import { getAllGroups, handleEvent, initialState } from '../../../src/shared-read-models/groups';
import { arbitraryGroup } from '../../types/group.helper';

describe('get-all-groups', () => {
  const group1 = arbitraryGroup();
  const group2 = arbitraryGroup();
  const group3 = arbitraryGroup();
  const events = [
    groupJoined(
      group2.id,
      group2.name,
      group2.avatarPath,
      group2.descriptionPath,
      group2.shortDescription,
      group2.homepage,
      group2.slug,
    ),
    groupJoined(
      group3.id,
      group3.name,
      group3.avatarPath,
      group3.descriptionPath,
      group3.shortDescription,
      group3.homepage,
      group3.slug,
    ),
  ];

  it('returns all groups in arbitrary order', () => {
    let groupsReadModelInstance = RA.reduce(initialState(), handleEvent)(events);
    const query = getAllGroups(groupsReadModelInstance);
    groupsReadModelInstance = RA.reduce(groupsReadModelInstance, handleEvent)([groupJoined(
      group1.id,
      group1.name,
      group1.avatarPath,
      group1.descriptionPath,
      group1.shortDescription,
      group1.homepage,
      group1.slug,
    )]);

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
