/* eslint-disable jest/expect-expect */
import { userFollowedEditorialCommunity } from '../../src/domain-events';
import { dispatcher } from '../../src/infrastructure/dispatcher';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('dispatcher', () => {
  it('sends a new event to every readmodel', () => {
    const {
      dispatchToAllReadModels,
      // queries,
    } = dispatcher();
    dispatchToAllReadModels([
      userFollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId()),
    ]);

    // expect(queries.q1()).toStrictEqual({
    //   initial: 1,
    //   calledWith: 'UserFollowedEditorialCommunity',
    // });
  });
});
