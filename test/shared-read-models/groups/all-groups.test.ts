import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryUninterestingEvents } from './arbitrary-uninteresting-events.helper';
import { groupJoined } from '../../../src/domain-events';
import { getAllGroups } from '../../../src/shared-read-models/groups';
import { arbitraryGroup } from '../../types/group.helper';

describe('allGroups', () => {
  const group1 = arbitraryGroup();
  const group2 = arbitraryGroup();
  const group3 = arbitraryGroup();
  const groupNames = pipe(
    [
      ...arbitraryUninterestingEvents,
      groupJoined(group2),
      groupJoined(group3),
      groupJoined(group1),
      ...arbitraryUninterestingEvents,
    ],
    getAllGroups,
    RA.map((group) => group.name),
  );

  it('returns all groups in arbitrary order', () => {
    expect(groupNames).toContain(group1.name);
    expect(groupNames).toContain(group2.name);
    expect(groupNames).toContain(group3.name);
  });
});
