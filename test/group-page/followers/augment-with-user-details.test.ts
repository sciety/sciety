import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { augmentWithUserDetails } from '../../../src/group-page/followers/augment-with-user-details';
import {
  arbitraryNumber, arbitraryString, arbitraryUri, arbitraryWord,
} from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('augment-with-user-details', () => {
  describe('not all user details are returned from the port', () => {
    it('returns a shorter array of user card view models', async () => {
      const userId1 = arbitraryUserId();
      const listCount1 = 1;
      const handle1 = arbitraryWord();
      const userId3 = arbitraryUserId();
      const listCount3 = 3;
      const handle3 = arbitraryWord();
      const ports = {
        getUserDetailsBatch: () => TE.right([
          {
            userId: userId1,
            handle: handle1,
            avatarUrl: arbitraryUri(),
            displayName: arbitraryString(),
          },
          {
            userId: userId3,
            handle: handle3,
            avatarUrl: arbitraryUri(),
            displayName: arbitraryString(),
          },
        ]),
      };
      const followers = [
        {
          userId: userId1,
          listCount: listCount1,
          followedGroupCount: arbitraryNumber(0, 10),
        },
        {
          userId: arbitraryUserId(),
          listCount: arbitraryNumber(0, 10),
          followedGroupCount: arbitraryNumber(0, 10),
        },
        {
          userId: userId3,
          listCount: listCount3,
          followedGroupCount: arbitraryNumber(0, 10),
        },
      ];
      const results = await pipe(
        followers,
        augmentWithUserDetails(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(results).toHaveLength(2);
      expect(results[0]).toStrictEqual(expect.objectContaining({
        listCount: listCount1,
        handle: handle1,
      }));
      expect(results[1]).toStrictEqual(expect.objectContaining({
        listCount: listCount3,
        handle: handle3,
      }));
    });
  });

  it('returns the user card view models in the same order as the input followers', async () => {
    const userId1 = arbitraryUserId();
    const handle1 = arbitraryWord();
    const userId2 = arbitraryUserId();
    const handle2 = arbitraryWord();
    const ports = {
      getUserDetailsBatch: () => TE.right([
        {
          userId: userId2,
          handle: handle2,
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
        },
        {
          userId: userId1,
          handle: handle1,
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
        },
      ]),
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
    const [{ handle: resultHandle1 }, { handle: resultHandle2 }] = await pipe(
      followers,
      augmentWithUserDetails(ports),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(resultHandle1).toStrictEqual(handle1);
    expect(resultHandle2).toStrictEqual(handle2);
  });
});
