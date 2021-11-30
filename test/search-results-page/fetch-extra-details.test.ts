import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { groupCreated } from '../../src/domain-events';
import { fetchExtraDetails } from '../../src/search-results-page/fetch-extra-details';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { arbitraryNumber } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('fetch-extra-details', () => {
  const numberOfPages = arbitraryNumber(0, 10);

  describe('given a found article', () => {
    it('returns a correct view model', async () => {
      const pageNumber = arbitraryNumber(2, 5);
      const latestVersionDate = new Date();
      const latestActivityDate = new Date('2021-01-02');
      const ports = {
        findReviewsForArticleDoi: () => TE.right([
          {
            reviewId: arbitraryReviewId(),
            groupId: arbitraryGroupId(),
            recordedAt: new Date('2021-01-01'),
          },
          {
            reviewId: new Doi('10.1101/222222'),
            groupId: arbitraryGroupId(),
            recordedAt: latestActivityDate,
          },
        ]),
        getAllEvents: shouldNotBeCalled,
        getLatestArticleVersionDate: () => T.of(O.some(latestVersionDate)),
      };

      const matches = {
        query: '',
        category: 'articles',
        availableArticleMatches: 5,
        availableGroupMatches: 0,
        itemsToDisplay: [
          {
            _tag: 'Article' as const,
            doi: new Doi('10.1101/222222'),
            server: 'biorxiv' as const,
            title: pipe('', toHtmlFragment, sanitise),
            authors: O.some([]),
          },
        ],
        nextCursor: O.none,
        pageNumber,
        numberOfPages,
      };
      const viewModel = await fetchExtraDetails(ports)(matches)();

      expect(viewModel).toStrictEqual({
        query: '',
        category: 'articles',
        availableArticleMatches: 5,
        availableGroupMatches: 0,
        itemsToDisplay: [
          expect.objectContaining({
            evaluationCount: 2,
            latestVersionDate: O.some(latestVersionDate),
            latestActivityDate: O.some(latestActivityDate),
          }),
        ],
        nextCursor: O.none,
        pageNumber,
        numberOfPages,
      });
    });
  });

  describe('given a found group', () => {
    describe('when the details can be fetched', () => {
      it('returns a correct view model', async () => {
        const pageNumber = arbitraryNumber(2, 5);
        const group = arbitraryGroup();
        const ports = {
          findReviewsForArticleDoi: shouldNotBeCalled,
          getAllEvents: T.of([groupCreated(group)]),
          getLatestArticleVersionDate: shouldNotBeCalled,
        };
        const matches = {
          query: '',
          category: 'groups',
          availableArticleMatches: 0,
          availableGroupMatches: 5,
          itemsToDisplay: [
            {
              _tag: 'Group' as const,
              id: group.id,
            },
          ],
          nextCursor: O.none,
          pageNumber,
          numberOfPages,
        };
        const viewModel = await fetchExtraDetails(ports)(matches)();

        expect(viewModel).toStrictEqual({
          query: '',
          category: 'groups',
          availableArticleMatches: 0,
          availableGroupMatches: 5,
          itemsToDisplay: [
            expect.objectContaining({
              reviewCount: 0,
              followerCount: 0,
            }),
          ],
          nextCursor: O.none,
          pageNumber,
          numberOfPages,
        });
      });
    });

    describe('when the details cannot be fetched', () => {
      it('removes the group from the list', async () => {
        const pageNumber = arbitraryNumber(2, 5);
        const ports = {
          findReviewsForArticleDoi: shouldNotBeCalled,
          getAllEvents: T.of([]),
          getLatestArticleVersionDate: shouldNotBeCalled,
        };
        const matches = {
          query: '',
          category: 'groups',
          availableArticleMatches: 0,
          availableGroupMatches: 0,
          itemsToDisplay: [
            {
              _tag: 'Group' as const,
              id: arbitraryGroupId(),
            },
          ],
          nextCursor: O.none,
          pageNumber,
          numberOfPages,
        };
        const viewModel = await fetchExtraDetails(ports)(matches)();

        expect(viewModel).toStrictEqual(expect.objectContaining({
          query: '',
          category: 'groups',
          availableArticleMatches: 0,
          availableGroupMatches: 0,
          itemsToDisplay: [],
          pageNumber,
          numberOfPages,
        }));
      });
    });
  });
});
