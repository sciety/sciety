import { Maybe } from 'true-myth';
import { FeedEvent, RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: Maybe<UserId>) => Promise<string>;

export type IsFollowingSomething = (userId: UserId) => Promise<boolean>;

export type GetEvents = (userId: UserId) => Promise<ReadonlyArray<FeedEvent>>;

export { FeedEvent } from './render-feed-item';

export default (
  isFollowingSomething: IsFollowingSomething,
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (userId) => {
    let contents = '';
    if (userId.isNothing()) {
      contents = `
        <p class="log-in-invitation">
          <a href="/sign-in">Log in</a> to see your feed here or start building a new one by following some communities!
          <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" width="100%">
        </p>
      `;
    } else if (!(await isFollowingSomething(userId.unsafelyUnwrap()))) {
      contents = `
        <p>
          Your feed is empty! Start following some communities to see their most recent evaluations right here.
        </p>
      `;
    } else {
      const events = await getEvents(userId.unsafelyUnwrap());
      if (events.length > 0) {
        const feedItems = await Promise.all(events.map(renderFeedItem));
        contents = `
          <ol class="ui large feed" role="list">
            ${templateListItems(feedItems, 'event')}
          </ol>
        `;
      } else {
        contents = `
          <p class="come-back-invitation">
            The communities you follow haven’t made any evaluations yet,
            come back any time to see their updates later.
          </p>
        `;
      }
    }
    return `
      <section>
        <h2 class="ui header">
          Feed
        </h2>
        ${contents}
      </section>
    `;
  }
);
