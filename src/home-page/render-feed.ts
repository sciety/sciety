import createRenderFeedItem, { Event, GetActor, GetArticle } from './render-feed-item';
import templateListItems from '../templates/list-items';

type RenderFeed = () => Promise<string>;

export { Event, GetActor, GetArticle } from './render-feed-item';

export type GetEvents = () => Promise<Array<Event>>;

export default (
  getEvents: GetEvents,
  getActor: GetActor,
  getArticle: GetArticle,
): RenderFeed => {
  const renderFeedItem = createRenderFeedItem(getActor, getArticle);
  return async () => {
    const events = await getEvents();
    const feedItems = await Promise.all(events.map(renderFeedItem));
    return `
      <section>
        <h2 class="ui header">
          Feed
        </h2>
        <ol class="ui large feed">
          ${templateListItems(feedItems, 'event')}
        </ol>
      </section>
    `;
  };
};
