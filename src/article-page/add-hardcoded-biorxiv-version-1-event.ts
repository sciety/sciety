import { Result } from 'true-myth';
import { ArticleVersionEvent, GetFeedEvents } from './get-feed-events-content';
import createGetHardcodedArticleVersionEvents from './get-hardcoded-article-version-events';
import Doi from '../types/doi';

type FetchArticle = (doi: Doi) => Promise<Result<{
  publicationDate: Date;
}, unknown>>;

export type GetArticleVersionEvents = (doi: Doi) => Promise<ReadonlyArray<ArticleVersionEvent>>;

export default (
  getFeedEvents: GetFeedEvents,
  fetchArticle: FetchArticle,
): GetFeedEvents => {
  const getArticleVersionEvents = createGetHardcodedArticleVersionEvents(fetchArticle);

  return async (doi) => {
    const [feedEvents, versionEvents] = await Promise.all([
      getFeedEvents(doi),
      getArticleVersionEvents(doi),
    ]);

    return [...feedEvents, ...versionEvents].sort((a, b) => {
      const aDate = a.type === 'article-version' ? a.postedAt : a.occurredAt;
      const bDate = b.type === 'article-version' ? b.postedAt : b.occurredAt;
      return bDate.getTime() - aDate.getTime();
    });
  };
};
