import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails, Ports } from '../../../../src/html-pages/group-page/followers/augment-with-user-details';
import { UserId } from '../../../../src/types/user-id';
import {
  arbitraryNumber, arbitraryString, arbitraryUri,
} from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('augment-with-user-details', () => {
  describe('not all user details are returned from the port', () => {
    it('returns a shorter array of user card view models', async () => {
      const ports: Ports = {
        getUser: () => O.none,
      };
      const followers = [
        {
          userId: arbitraryUserId(),
          listCount: arbitraryNumber(0, 10),
          followedGroupCount: arbitraryNumber(0, 10),
        },
      ];
      const results = await pipe(
        followers,
        augmentWithUserDetails(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(results).toHaveLength(0);
    });
  });

  it('returns the user card view models in the same order as the input followers', async () => {
    const userId1 = arbitraryUserId();
    const userId2 = arbitraryUserId();
    const ports = {
      getUser: (userId: UserId) => O.some(
        {
          id: userId,
          handle: userId.toString(),
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
        },
      ),
    };
    const followers = [
      {
        userId: userId1,
        listCount: arbitraryNumber(0, 10),
        followedGroupCount: arbitraryNumber(0, 10),
      },
      {
        userId: userId2,
        listCount: arbitraryNumber(0, 10),
        followedGroupCount: arbitraryNumber(0, 10),
      },
    ];
    const handles = await pipe(
      followers,
      augmentWithUserDetails(ports),
      TE.map(RA.map((user) => user.handle)),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(handles).toStrictEqual([userId1, userId2]);
  });
});
