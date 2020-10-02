import { URL } from 'url';
import { Maybe } from 'true-myth';
import createGetFeedReviews, { GetEditorialCommunity, GetFeedEvents, GetReview } from '../../src/article-page/get-feed-reviews';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('when there are reviews', () => {
  it('creates a view model for the reviews', async () => {
    const getFeedEvents: GetFeedEvents = async () => [
      {
        editorialCommunityId: new EditorialCommunityId('communityId'),
        reviewId: new Doi('10.1101/111111'),
        occurredAt: new Date(),
      },
      {
        editorialCommunityId: new EditorialCommunityId('communityId'),
        reviewId: new Doi('10.1101/222222'),
        occurredAt: new Date(),
      },
    ];
    const getReview: GetReview = async () => ({
      fullText: Maybe.just('some text'),
      url: new URL('http://example.com'),
    });
    const getEditorialCommunity: GetEditorialCommunity = async () => ({
      name: 'A Community',
      avatar: new URL('https://example.com/avatar'),
    });
    const getFeedReviews = createGetFeedReviews(getFeedEvents, getReview, getEditorialCommunity);
    const viewModel = await getFeedReviews(new Doi('10.1101/123456'));

    expect(viewModel).toHaveLength(2);
  });
});
