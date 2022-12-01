import * as RA from 'fp-ts/ReadonlyArray';
import { groupJoined } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/stateful-groups';
import { ReadModel } from '../../../src/shared-read-models/stateful-groups/handle-event';
import { arbitraryGroup } from '../../types/group.helper';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllGroups = (readmodel: ReadModel) => [];

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

  it.failing('returns all groups in arbitrary order', () => {
    expect(allGroups).toContain(group1.name);
    expect(allGroups).toContain(group2.name);
    expect(allGroups).toContain(group3.name);
  });
});
