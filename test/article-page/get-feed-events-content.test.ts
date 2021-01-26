import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import {
  GetEditorialCommunity, GetFeedEvents, getFeedEventsContent, GetReview,
} from '../../src/article-page/get-feed-events-content';
import { Doi } from '../../src/types/doi';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';

describe('get-feed-events-content', () => {
  describe('when there are reviews', () => {
    it('creates a view model for the reviews', async () => {
      const getFeedEvents: GetFeedEvents = async () => [
        {
          type: 'review',
          editorialCommunityId: new EditorialCommunityId('communityId'),
          reviewId: new Doi('10.1101/111111'),
          occurredAt: new Date(),
        },
        {
          type: 'review',
          editorialCommunityId: new EditorialCommunityId('communityId'),
          reviewId: new Doi('10.1101/222222'),
          occurredAt: new Date(),
        },
      ];
      const getReview: GetReview = () => T.of({
        fullText: pipe('some text', toHtmlFragment, O.some),
        url: new URL('http://example.com'),
      });
      const getEditorialCommunity: GetEditorialCommunity = async () => ({
        name: 'A Community',
        avatar: new URL('https://example.com/avatar'),
      });
      const viewModel = await getFeedEventsContent(getFeedEvents, getReview, getEditorialCommunity)(new Doi('10.1101/123456'), 'biorxiv');

      expect(viewModel).toHaveLength(2);
    });
  });
});
