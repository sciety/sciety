import { GetFeedEvents } from './get-feed-events-content';

export default (
  ...composedGetFeedEvents: Array<GetFeedEvents>
): GetFeedEvents => (
  async (doi) => {
    const events = await Promise.all(composedGetFeedEvents.map(async (getFeedEvents) => getFeedEvents(doi)));

    return events.flat().sort((a, b) => {
      const aDate = a.type === 'article-version' ? a.occurredAt : a.occurredAt;
      const bDate = b.type === 'article-version' ? b.occurredAt : b.occurredAt;
      return bDate.getTime() - aDate.getTime();
    });
  }
);
