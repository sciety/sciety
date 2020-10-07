import { URL } from 'url';
import { Result } from 'true-myth';
import { ArticleVersionEvent, GetFeedEvents } from './get-feed-events-content';
import Doi from '../types/doi';

type FetchArticle = (doi: Doi) => Promise<Result<{
  publicationDate: Date;
}, unknown>>;

type GetArticleVersionEvents = (doi: Doi) => Promise<ReadonlyArray<ArticleVersionEvent>>;

export default (
  getFeedEvents: GetFeedEvents,
  fetchArticle: FetchArticle,
): GetFeedEvents => {
  const getArticleVersionEvents: GetArticleVersionEvents = async (doi) => {
    if (doi.value === '10.1101/2020.09.02.278911') {
      return [
        {
          type: 'article-version',
          source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v2'),
          postedAt: new Date('2020-09-24'),
          version: 2,
        },
        {
          type: 'article-version',
          source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v1'),
          postedAt: new Date('2020-09-03'),
          version: 1,
        },
      ];
    }

    return [{
      type: 'article-version',
      source: new URL(`https://www.biorxiv.org/content/${doi.value}v1?versioned=true`),
      postedAt: (await fetchArticle(doi)).unsafelyUnwrap().publicationDate,
      version: 1,
    }];
  };

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
