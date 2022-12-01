import * as RA from 'fp-ts/ReadonlyArray';
import { groupJoined } from '../../../src/domain-events';
import { getAllGroups, handleEvent, initialState } from '../../../src/shared-read-models/stateful-groups';
import { arbitraryGroup } from '../../types/group.helper';

describe('get-all-groups', () => {
  const group1 = arbitraryGroup();
  const group2 = arbitraryGroup();
  const group3 = arbitraryGroup();
  const events = [
    groupJoined(group2),
    groupJoined(group3),
    groupJoined(group1),
  ];

  const groupsReadModelInstance = RA.reduce(initialState(), handleEvent)(events);

  const allGroups = getAllGroups(groupsReadModelInstance);

  it('returns all groups in arbitrary order', () => {
    expect(allGroups).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: group1.name }),
        expect.objectContaining({ name: group2.name }),
        expect.objectContaining({ name: group3.name }),
      ]),
    );
  });
});
