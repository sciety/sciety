import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { fetchExtraDetails } from '../../src/search-results-page/fetch-extra-details';
import { Doi } from '../../src/types/doi';
import { GroupId } from '../../src/types/group-id';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('fetch-extra-details', () => {
  describe('given a found article', () => {
    it('returns a correct view model', async () => {
      const ports = {
        findReviewsForArticleDoi: () => T.of([
          {
            reviewId: new Doi('10.1101/111111'),
            editorialCommunityId: new GroupId('my-group'),
          },
        ]),
        getAllEvents: shouldNotBeCalled,
        getGroup: shouldNotBeCalled,
      };
      const matches = {
        query: '',
        availableMatches: 5,
        itemsToDisplay: [
          {
            _tag: 'Article' as const,
            doi: new Doi('10.1101/222222'),
            title: '',
            authors: '',
            postedDate: new Date(),
          },
        ],
      };
      const viewModel = await fetchExtraDetails(ports)(matches)();

      expect(viewModel).toStrictEqual(E.right({
        query: '',
        availableMatches: 5,
        itemsToDisplay: [
          expect.objectContaining({
            reviewCount: 1,
          }),
        ],
      }));
    });
  });

  describe('given a found group', () => {
    describe('when the details can be fetched', () => {
      it.todo('returns a correct view model');
    });

    describe('when the details cannot be fetched', () => {
      it.todo('removes the group from the list');
    });
  });
});
