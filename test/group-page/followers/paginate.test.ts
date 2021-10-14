import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { paginate } from '../../../src/group-page/followers/paginate';
import * as DE from '../../../src/types/data-error';
import { arbitraryNumber } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryUserId } from '../../types/user-id.helper';

const generateFollowers = (followerCount: number) => pipe(
  Array(followerCount).keys(),
  Array.from,
  RA.map(() => ({
    userId: arbitraryUserId(),
    listCount: arbitraryNumber(0, 10),
    followedGroupCount: arbitraryNumber(0, 10),
  })),
);

describe('paginate', () => {
  describe('when the group has multiple followers', () => {
    it('limits the number of followers to the requested page size', () => {
      const result = pipe(
        generateFollowers(3),
        paginate(1, 2),
        E.getOrElseW(shouldNotBeCalled),
      );

      expect(result.items).toHaveLength(2);
    });

    it('returns the specified page of the followers', () => {
      const userId = arbitraryUserId();
      const [follower1, follower2] = generateFollowers(2);
      const result = pipe(
        [
          follower1,
          {
            userId,
            listCount: arbitraryNumber(0, 10),
            followedGroupCount: arbitraryNumber(0, 10),
          },
          follower2,
        ],
        paginate(2, 1),
        E.getOrElseW(shouldNotBeCalled),
      );

      expect(result.items).toStrictEqual([
        expect.objectContaining({
          userId,
        }),
      ]);
    });

    it.each([
      [9, 1, O.none],
      [11, 1, O.some(2)],
      [20, 1, O.some(2)],
      [20, 2, O.none],
      [21, 2, O.some(3)],
      [21, 3, O.none],
    ])('given %d followers and a request for page %d, returns the next page', (followerCount, page, nextPage) => {
      const result = pipe(
        generateFollowers(followerCount),
        paginate(page, 10),
        E.getOrElseW(shouldNotBeCalled),
      );

      expect(result.nextPage).toStrictEqual(nextPage);
    });

    it('returns not-found when asked for a page that does not exist', () => {
      const result = pipe(
        generateFollowers(3),
        paginate(3, 3),
      );

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });

  describe('when there are no followers', () => {
    const pageOfFollowers = pipe(
      [],
      paginate(1, arbitraryNumber(1, 10)),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('returns an empty page 1', () => {
      expect(pageOfFollowers).toStrictEqual({
        items: [],
        pageNumber: 1,
        numberOfPages: 0,
        nextPage: O.none,
        numberOfOriginalItems: 0,
      });
    });
  });
});
