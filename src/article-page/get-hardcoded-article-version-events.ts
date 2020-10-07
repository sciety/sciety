import { URL } from 'url';
import { Result } from 'true-myth';
import { GetFeedEvents } from './get-feed-events-content';
import Doi from '../types/doi';

type FetchArticle = (doi: Doi) => Promise<Result<{
  publicationDate: Date;
}, unknown>>;

export default (fetchArticle: FetchArticle): GetFeedEvents => (
  async (doi) => {
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
  }
);
