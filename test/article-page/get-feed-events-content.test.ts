import { URL } from 'url';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  Feed, getFeedEventsContent, GetReview,
} from '../../src/article-page/get-feed-events-content';
import { Doi } from '../../src/types/doi';
import { GroupId } from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';

describe('get-feed-events-content', () => {
  describe('when there are reviews', () => {
    it('creates a view model for the reviews', async () => {
      const getFeedEvents: Feed = () => T.of([
        {
          type: 'review',
          editorialCommunityId: new GroupId('communityId'),
          reviewId: new Doi('10.1101/111111'),
          occurredAt: new Date(),
        },
        {
          type: 'review',
          editorialCommunityId: new GroupId('communityId'),
          reviewId: new Doi('10.1101/222222'),
          occurredAt: new Date(),
        },
      ]);
      const getReview: GetReview = () => TE.right({
        fullText: pipe('some text', toHtmlFragment),
        url: new URL('http://example.com'),
      });
      const getEditorialCommunity = () => T.of({
        name: 'A Community',
        avatarPath: 'https://example.com/avatar',
      });
      const viewModel = await getFeedEventsContent(getFeedEvents, getReview, getEditorialCommunity)(new Doi('10.1101/123456'), 'biorxiv')();

      expect(viewModel).toHaveLength(2);
    });
  });
});
