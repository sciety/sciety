import { GetFeedEvents } from './get-feed-events-content';

export default (
  ...composedGetFeedEvents: Array<GetFeedEvents>
): GetFeedEvents => (
  async (doi) => {
    const events = await Promise.all(composedGetFeedEvents.map(async (getFeedEvents) => getFeedEvents(doi)));

    return events.flat().sort((a, b) => {
      const aDate = a.type === 'article-version' ? a.postedAt : a.occurredAt;
      const bDate = b.type === 'article-version' ? b.postedAt : b.occurredAt;
      return bDate.getTime() - aDate.getTime();
    });
  }
);
