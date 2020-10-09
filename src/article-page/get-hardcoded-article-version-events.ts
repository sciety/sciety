import { URL } from 'url';
import { Result } from 'true-myth';
import { GetFeedEvents } from './get-feed-events-content';
import Doi from '../types/doi';

type FetchArticle = (doi: Doi) => Promise<Result<{
  publicationDate: Date;
}, unknown>>;

export default (
  fetchArticle: FetchArticle,
): GetFeedEvents => (
  async (doi) => {
    if (doi.value === '10.1101/2020.09.02.278911') {
      const biorxivResponse = {
        collection: [
          {
            date: '2020-09-03',
            version: '1',
          },
          {
            version: '2',
            date: '2020-09-24',
          },
        ],
      };
      return biorxivResponse.collection.map((articleDetail) => ({
        type: 'article-version',
        source: new URL(`https://www.biorxiv.org/content/${doi.value}v${articleDetail.version}`),
        postedAt: new Date(articleDetail.date),
        version: Number.parseInt(articleDetail.version, 10),
      }));
    }

    return [{
      type: 'article-version',
      source: new URL(`https://www.biorxiv.org/content/${doi.value}v1?versioned=true`),
      postedAt: (await fetchArticle(doi)).unsafelyUnwrap().publicationDate,
      version: 1,
    }];
  }
);
