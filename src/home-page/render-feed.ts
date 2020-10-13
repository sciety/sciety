import { Maybe } from 'true-myth';
import templateListItems from '../templates/list-items';
import { FeedEvent, RenderFeedItem } from '../templates/render-feed-item';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: Maybe<UserId>) => Promise<string>;

export type IsFollowingSomething = (userId: UserId) => Promise<boolean>;

export type GetEvents = (userId: UserId) => Promise<ReadonlyArray<FeedEvent>>;

export { FeedEvent } from '../templates/render-feed-item';

export default (
  isFollowingSomething: IsFollowingSomething,
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (userId) => {
    let contents = '';
    if (userId.isNothing()) {
      contents = `
        <p>Welcome to The Hive.</p>
        <p>
          Follow research as it develops and stay up to date with the next big thing,
          evaluated by the editorial communities you trust.
        </p>
        <p>
          <a href="/log-in">Log in with Twitter</a> to see your feed here or start building a new one
          by following some communities!
        </p>
        <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" class="feed__image">
      `;
    } else if (!(await isFollowingSomething(userId.unsafelyUnwrap()))) {
      contents = `
        <p>
          Your feed is empty! Start following some communities to see their most recent evaluations right here.
        </p>
        <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" class="feed__image">
      `;
    } else {
      const events = await getEvents(userId.unsafelyUnwrap());
      if (events.length > 0) {
        const feedItems = await Promise.all(events.map(renderFeedItem));
        contents = `
          <ol class="home-page-feed" role="list">
            ${templateListItems(feedItems, 'home-page-feed__item')}
          </ol>
        `;
      } else {
        contents = `
          <p>
            The communities you’re following haven’t evaluated any articles yet.
            You can have a look for other communities of interest, or try coming back later!
          </p>
        `;
      }
    }
    return `
      <section>
        <h2>
          Feed
        </h2>
        ${contents}
      </section>
    `;
  }
);
