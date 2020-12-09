import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export type IsFollowingSomething = (userId: UserId) => Promise<boolean>;

export type GetEvents<E> = (userId: UserId) => Promise<ReadonlyArray<E>>;

type RenderSummaryFeedList<E> = (events: ReadonlyArray<E>) => Promise<O.Option<string>>;

const toMaybe = (uid: O.Option<UserId>): Maybe<UserId> => (
  O.fold(
    () => Maybe.nothing<UserId>(),
    (u: UserId) => Maybe.just(u),
  )(uid)
);

const noEvaluationsYet = (): string => `
  <p>
    The communities you’re following haven’t evaluated any articles yet.
    You can have a look for other communities of interest, or try coming back later!
  </p>
`;

export default <E>(
  isFollowingSomething: IsFollowingSomething,
  getEvents: GetEvents<E>,
  renderSummaryFeedList: RenderSummaryFeedList<E>,
): RenderFeed => (
  (uid) => async () => {
    let contents = '';
    const userId = toMaybe(uid);
    if (userId.isNothing()) {
      contents = toHtmlFragment(`
        <p>Welcome to Sciety.</p>
        <p>
          Follow research as it develops and stay up to date with the next big thing,
          evaluated by the editorial communities you trust.
        </p>
        <p>
          <a href="/log-in">Log in with Twitter</a> to see your feed here or start building a new one
          by following some communities!
        </p>
        <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" class="feed__image">
      `);
    } else if (!(await isFollowingSomething(userId.unsafelyUnwrap()))) {
      contents = toHtmlFragment(`
        <p>
          Your feed is empty! Start following some communities to see their most recent evaluations right here.
        </p>
        <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" class="feed__image">
      `);
    } else {
      const events = await getEvents(userId.unsafelyUnwrap());
      contents = toHtmlFragment(O.getOrElse(noEvaluationsYet)(await renderSummaryFeedList(events)));
    }
    return toHtmlFragment(`
      <section>
        <h2>
          Feed
        </h2>
        ${contents}
      </section>
    `);
  }
);
