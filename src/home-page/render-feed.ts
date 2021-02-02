import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { constant, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export type IsFollowingSomething = (userId: UserId) => T.Task<boolean>;

export type GetEvents<E> = (userId: UserId) => T.Task<ReadonlyArray<E>>;

export type RenderSummaryFeedList<E> = (events: ReadonlyArray<E>) => T.Task<O.Option<string>>;

const welcomeMessage = `
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
`;

const followSomething = `
  <p>
    Your feed is empty! Start following some communities to see their most recent evaluations right here.
  </p>
  <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" class="feed__image">
`;

const noEvaluationsYet = (): string => `
  <p>
    The communities you’re following haven’t evaluated any articles yet.
    You can have a look for other communities of interest, or try coming back later!
  </p>
`;

const renderAsSection = (contents: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <section>
    <h2>
      Feed
    </h2>
    ${contents}
  </section>
`);

export const createRenderFeed = <E>(
  isFollowingSomething: IsFollowingSomething,
  getEvents: GetEvents<E>,
  renderSummaryFeedList: RenderSummaryFeedList<E>,
): RenderFeed => (
    (uid) => async () => {
      const userFeed = (u: UserId): T.Task<string> => pipe(
        u,
        isFollowingSomething,
        T.chain(B.fold(
          constant(T.of(followSomething)),
          () => pipe(
            u,
            getEvents,
            T.chain(renderSummaryFeedList),
            T.map(O.getOrElse(noEvaluationsYet)),
          ),
        )),
      );

      return pipe(
        uid,
        O.fold(
          constant(TE.left(welcomeMessage)),
          (u) => TE.rightTask(userFeed(u)),
        ),
        TE.fold(
          (left) => T.of(left),
          (right) => T.of(right),
        ),
        T.map(toHtmlFragment),
        T.map(renderAsSection),
      )();
    }
  );
