import { GetFeedItems } from './render-feed';

export default (
  getFeedItems: GetFeedItems,
): GetFeedItems => (
  async (doi) => {
    const feedItems = Array.from(await getFeedItems(doi));
    if (doi.value === '10.1101/646810') {
      feedItems.push({ type: 'article-version-error' });
    }
    return feedItems;
  }
);
