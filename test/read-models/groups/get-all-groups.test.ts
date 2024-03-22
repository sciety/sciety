import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/read-models/groups/handle-event';
import { getAllGroups } from '../../../src/read-models/groups/get-all-groups';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';

describe('get-all-groups', () => {
  const group1JoinedEvent = arbitraryGroupJoinedEvent();
  const group2JoinedEvent = arbitraryGroupJoinedEvent();
  const group3JoinedEvent = arbitraryGroupJoinedEvent();
  const events = [
    group2JoinedEvent,
    group3JoinedEvent,
    group1JoinedEvent,
  ];
  const groupsReadModelInstance = RA.reduce(initialState(), handleEvent)(events);
  const allGroupsNames = pipe(
    getAllGroups(groupsReadModelInstance)(),
    RA.map((group) => group.name),
  );

  it('returns all groups in arbitrary order', () => {
    expect(allGroupsNames).toHaveLength(3);
    expect(allGroupsNames).toContain(group1JoinedEvent.name);
    expect(allGroupsNames).toContain(group2JoinedEvent.name);
    expect(allGroupsNames).toContain(group3JoinedEvent.name);
  });
});
