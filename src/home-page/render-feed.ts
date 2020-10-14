import { Maybe } from 'true-myth';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: Maybe<UserId>) => Promise<string>;

export type IsFollowingSomething = (userId: UserId) => Promise<boolean>;

export type GetEvents<T> = (userId: UserId) => Promise<ReadonlyArray<T>>;

type RenderSummaryFeedList<T> = (events: ReadonlyArray<T>) => Promise<Maybe<string>>;

export default <T>(
  isFollowingSomething: IsFollowingSomething,
  getEvents: GetEvents<T>,
  renderSummaryFeedList: RenderSummaryFeedList<T>,
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
      contents = (await renderSummaryFeedList(events)).unwrapOr(`
        <p>
          The communities you’re following haven’t evaluated any articles yet.
          You can have a look for other communities of interest, or try coming back later!
        </p>
      `);
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
