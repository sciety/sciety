import { GetFeedItems } from './render-feed';

export const createHandleArticleVersionErrors = (
  getFeedItems: GetFeedItems,
): GetFeedItems => (
  async (doi) => {
    const feedItems = Array.from(await getFeedItems(doi));
    if (!feedItems.some((feedItem) => feedItem.type === 'article-version')) {
      const server = doi.value === '10.1101/2020.09.03.20184051' ? 'medrxiv' : 'biorxiv';
      feedItems.push({ type: 'article-version-error', server });
    }
    return feedItems;
  }
);
