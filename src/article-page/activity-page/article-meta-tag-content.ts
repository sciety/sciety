import { FeedItem } from './render-feed';

export type MetaDescription = {
  evaluationCount: number,
};

export const articleMetaTagContent = (feedItems: ReadonlyArray<FeedItem>): MetaDescription => ({
  evaluationCount: feedItems.filter((item) => item.type === 'review').length,
});
