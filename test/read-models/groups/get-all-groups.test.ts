import * as RA from 'fp-ts/ReadonlyArray';
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
  const allGroups = getAllGroups(groupsReadModelInstance)();

  it('returns all groups in arbitrary order', () => {
    expect(allGroups).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: group1JoinedEvent.name }),
        expect.objectContaining({ name: group2JoinedEvent.name }),
        expect.objectContaining({ name: group3JoinedEvent.name }),
      ]),
    );
  });
});
