import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { fetchExtraDetails } from '../../src/search-results-page/fetch-extra-details';
import { Doi } from '../../src/types/doi';
import { GroupId } from '../../src/types/group-id';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('fetch-extra-details', () => {
  describe('given a found article', () => {
    it('returns a correct view model', async () => {
      const latestVersionDate = new Date();
      const ports = {
        findReviewsForArticleDoi: () => T.of([
          {
            reviewId: new Doi('10.1101/111111'),
            groupId: new GroupId('my-group'),
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
            title: '',
            authors: '',
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
            reviewCount: 1,
            latestVersionDate: O.some(latestVersionDate),
          }),
        ],
      });
    });
  });

  describe('given a found group', () => {
    describe('when the details can be fetched', () => {
      it('returns a correct view model', async () => {
        const ports = {
          findReviewsForArticleDoi: shouldNotBeCalled,
          getAllEvents: T.of([]),
          getGroup: () => T.of(O.some({
            id: new GroupId('my-group'),
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
              id: new GroupId('my-group'),
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
              id: new GroupId('my-group'),
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
