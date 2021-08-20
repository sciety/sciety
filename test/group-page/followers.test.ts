import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userFollowedEditorialCommunity } from '../../src/domain-events';
import { followers } from '../../src/group-page/followers/followers';
import { arbitraryUri, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';
/* eslint-disable jest/no-commented-out-tests */

describe('followers', () => {
  describe('when the group has multiple followers', () => {
    it.skip('limits the number of user cards to the requested page size', async () => {
      const groupId = arbitraryGroupId();
      const ports = {
        getAllEvents: T.of([
          userFollowedEditorialCommunity(arbitraryUserId(), groupId),
          userFollowedEditorialCommunity(arbitraryUserId(), groupId),
        ]),
        getUserDetails: () => TE.right({
          avatarUrl: arbitraryUri(),
          handle: arbitraryWord(),
          displayName: arbitraryWord(),

        }),
      };
      const rendered = await pipe(
        followers(ports)({ id: groupId }, 1),
        TE.getOrElse(shouldNotBeCalled),
      )();
      const component = JSDOM.fragment(rendered);
      const cards = component.querySelectorAll('.user-card');

      expect(cards).toHaveLength(2);
    });

    it.todo('returns the specified page of the followers');

    // it.each([
    //  [9, 1, O.none],
    //  [11, 1, O.some(2)],
    //  [20, 1, O.some(2)],
    //  [20, 2, O.none],
    //  [21, 2, O.some(3)],
    //  [21, 3, O.none],
    // ]).todo('given %d followers and a request for page %d, returns the next page');

    it.todo('returns not-found when asked for a page that does not exist');

    it.todo('returns an empty page 1 when there are no followers');
  });
});
