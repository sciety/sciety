import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { constant, flow, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export type IsFollowingSomething = (userId: UserId) => T.Task<boolean>;

export type GetEvents<E> = (userId: UserId) => T.Task<ReadonlyArray<E>>;

type RenderSummaryFeedList<E> = (events: RNEA.ReadonlyNonEmptyArray<E>) => T.Task<string>;

const welcomeMessage = `
  <p>Welcome to Sciety.</p>
  <p>
    Follow research as it develops and stay up to date with the next big thing,
    evaluated by the groups you trust.
  </p>
  <p>
    <a href="/log-in">Log in with Twitter</a> to see your feed here or start building a new one
    by following some groups!
  </p>
  <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" class="feed__image">
`;

const followSomething = `
  <p>
    Your feed is empty! Start following some groups to see their most recent evaluations right here.
  </p>
  <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" class="feed__image">
`;

const noEvaluationsYet = `
  <p>
    The groups you’re following haven’t evaluated any articles yet.
    You can have a look for other groups of interest, or try coming back later!
  </p>
`;

const renderAsSection = (contents: HtmlFragment) => toHtmlFragment(`
  <section>
    <h2>
      Feed
    </h2>
    ${contents}
  </section>
`);

export const renderFeed = <Err>(
  isFollowingSomething: IsFollowingSomething,
  getEvents: GetEvents<Err>,
  renderSummaryFeedList: RenderSummaryFeedList<Err>,
): RenderFeed => flow(
    TE.fromOption(constant(welcomeMessage)),
    TE.chainFirst((u) => pipe(
      u,
      isFollowingSomething,
      T.chain(
        B.fold(
          constant(TE.left(followSomething)),
          () => TE.right(u),
        ),
      ),
    )),
    TE.chainW(flow(
      getEvents,
      T.map(RNEA.fromReadonlyArray),
      T.chain(TE.fromOption(constant(noEvaluationsYet))),
    )),
    TE.chainTaskK(renderSummaryFeedList),
    TE.toUnion,
    T.map(flow(
      toHtmlFragment,
      renderAsSection,
    )),
  );
