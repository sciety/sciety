import { GetFeedItems } from './render-feed';

export default (
  getFeedItems: GetFeedItems,
): GetFeedItems => (
  async (doi) => {
    const feedItems = Array.from(await getFeedItems(doi));
    if (!feedItems.some((feedItem) => feedItem.type === 'article-version')) {
      feedItems.push({ type: 'article-version-error' });
    }
    return feedItems;
  }
);
