import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { fetchExtraDetails } from '../../src/search-results-page/fetch-extra-details';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('fetch-extra-details', () => {
  describe('given a found article', () => {
    it('returns a correct view model', async () => {
      const latestVersionDate = new Date();
      const latestActivityDate = new Date('2021-01-02');
      const ports = {
        findReviewsForArticleDoi: () => T.of([
          {
            reviewId: arbitraryReviewId(),
            groupId: arbitraryGroupId(),
            occurredAt: new Date('2021-01-01'),
          },
          {
            reviewId: new Doi('10.1101/222222'),
            groupId: arbitraryGroupId(),
            occurredAt: latestActivityDate,
          },
        ]),
        getAllEvents: shouldNotBeCalled,
        getGroup: shouldNotBeCalled,
        getLatestArticleVersionDate: () => T.of(O.some(latestVersionDate)),
      };
      const matches = {
        query: '',
        availableMatches: 5,
        itemsToDisplay: [
          {
            _tag: 'Article' as const,
            doi: new Doi('10.1101/222222'),
            server: 'biorxiv' as const,
            title: pipe('', toHtmlFragment, sanitise),
            authors: [],
            postedDate: new Date(),
          },
        ],
      };
      const viewModel = await fetchExtraDetails(ports)(matches)();

      expect(viewModel).toStrictEqual({
        query: '',
        availableMatches: 5,
        itemsToDisplay: [
          expect.objectContaining({
            evaluationCount: 2,
            latestVersionDate: O.some(latestVersionDate),
            latestActivityDate: O.some(latestActivityDate),
          }),
        ],
      });
    });
  });

  describe('given a found group', () => {
    describe('when the details can be fetched', () => {
      it('returns a correct view model', async () => {
        const groupId = arbitraryGroupId();
        const ports = {
          findReviewsForArticleDoi: shouldNotBeCalled,
          getAllEvents: T.of([]),
          getGroup: () => T.of(O.some({
            id: groupId,
            name: '',
            avatarPath: '',
            descriptionPath: '',
            shortDescription: '',
          })),
          getLatestArticleVersionDate: shouldNotBeCalled,
        };
        const matches = {
          query: '',
          availableMatches: 5,
          itemsToDisplay: [
            {
              _tag: 'Group' as const,
              id: groupId,
            },
          ],
        };
        const viewModel = await fetchExtraDetails(ports)(matches)();

        expect(viewModel).toStrictEqual({
          query: '',
          availableMatches: 5,
          itemsToDisplay: [
            expect.objectContaining({
              reviewCount: 0,
              followerCount: 0,
            }),
          ],
        });
      });
    });

    describe('when the details cannot be fetched', () => {
      it('removes the group from the list', async () => {
        const ports = {
          findReviewsForArticleDoi: shouldNotBeCalled,
          getAllEvents: shouldNotBeCalled,
          getGroup: () => T.of(O.none),
          getLatestArticleVersionDate: shouldNotBeCalled,
        };
        const matches = {
          query: '',
          availableMatches: 5,
          itemsToDisplay: [
            {
              _tag: 'Group' as const,
              id: arbitraryGroupId(),
            },
          ],
        };
        const viewModel = await fetchExtraDetails(ports)(matches)();

        expect(viewModel).toStrictEqual({
          query: '',
          availableMatches: 5,
          itemsToDisplay: [],
        });
      });
    });
  });
});
