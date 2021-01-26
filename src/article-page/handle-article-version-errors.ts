import { GetFeedItems } from './render-feed';

export const createHandleArticleVersionErrors = (
  getFeedItems: GetFeedItems,
): GetFeedItems => (
  async (doi, server) => {
    const feedItems = Array.from(await getFeedItems(doi, server));
    if (!feedItems.some((feedItem) => feedItem.type === 'article-version')) {
      feedItems.push({ type: 'article-version-error', server });
    }
    return feedItems;
  }
);
