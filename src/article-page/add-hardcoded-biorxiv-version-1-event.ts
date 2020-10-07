import { URL } from 'url';
import { Result } from 'true-myth';
import { GetFeedEvents } from './get-feed-events-content';
import Doi from '../types/doi';

type FetchArticle = (doi: Doi) => Promise<Result<{
  publicationDate: Date;
}, unknown>>;

export default (
  getFeedEvents: GetFeedEvents,
  fetchArticle: FetchArticle,
): GetFeedEvents => (
  async (doi) => {
    const feedEvents = Array.from(await getFeedEvents(doi));

    feedEvents.push({
      source: new URL(`https://www.biorxiv.org/content/${doi.value}v1?versioned=true`),
      postedAt: (await fetchArticle(doi)).unsafelyUnwrap().publicationDate,
      version: 1,
    });

    return feedEvents;
  }
);
