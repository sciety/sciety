import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { followedGroupsActivities } from './followed-groups-activities';
import {
  feedTitle,
  followSomething,
  noEvaluationsYet,
  troubleFetchingTryAgain,
} from './static-content';
import { ExpressionActivity } from '../../../../types/expression-activity';
import * as EDOI from '../../../../types/expression-doi';
import { GroupId } from '../../../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { UserId } from '../../../../types/user-id';
import { renderArticleCard } from '../../shared-components/article-card';
import { constructArticleCardStackWithSilentFailures } from '../../shared-components/article-card-stack';
import { renderListItems } from '../../shared-components/list-items';
import { renderListOfCards } from '../../shared-components/list-of-cards';
import { PageOfItems, paginate, renderLegacyPaginationControls } from '../../shared-components/pagination';

const renderAsSection = (contents: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <section>
    <h2>
      ${feedTitle}
    </h2>
    ${contents}
  </section>
`);

const getFollowedGroups = (dependencies: Dependencies) => (uid: UserId) => pipe(
  dependencies.getGroupsFollowedBy(uid),
  RNEA.fromReadonlyArray,
  E.fromOption(constant('no-groups-followed')),
);

const getEvaluatedArticles = (dependencies: Dependencies) => (groups: ReadonlyArray<GroupId>) => pipe(
  dependencies.getAllEvents,
  T.map((events) => followedGroupsActivities(events)(groups)),
  T.map(RNEA.fromReadonlyArray),
  T.map(E.fromOption(constant('no-groups-evaluated'))),
);

const constructArticleViewModels = (dependencies: Dependencies) => (items: ReadonlyArray<ExpressionActivity>) => pipe(
  items,
  RA.map((item) => EDOI.fromValidatedString(item.expressionDoi.value)),
  constructArticleCardStackWithSilentFailures(dependencies),
  T.map(RNEA.fromReadonlyArray),
  T.map(E.fromOption(constant('all-articles-failed'))),
);

const renderArticleCardList = (pageofItems: PageOfItems<unknown>) => flow(
  RNEA.map(renderArticleCard),
  (cards) => renderListItems(cards, 'my-feed__list_item'),
  renderListOfCards,
  (listOfCards) => `
    <p class="my-feed-page-numbers">
      Showing page <b>${pageofItems.pageNumber}</b> of <b>${pageofItems.numberOfPages}</b><span class="visually-hidden"> pages of articles that have been evaluated by groups that you follow.</span>
    </p>
    ${listOfCards}
    ${pipe(
    pageofItems.forwardPage,
    O.map((nextPage) => `/my-feed?page=${nextPage}`),
    O.map(renderLegacyPaginationControls),
    O.getOrElse(() => ''),
  )
}`,
);

type YourFeed = (dependencies: Dependencies) => (
  userId: UserId,
  pageSize: number,
  pageNumber: number,
) => T.Task<HtmlFragment>;

export const myFeed: YourFeed = (dependencies) => (userId, pageSize, pageNumber) => pipe(
  userId,
  TE.right,
  TE.chainEitherK(flow(
    getFollowedGroups(dependencies),
    E.mapLeft(constant(followSomething)),
  )),
  TE.flatMap(flow(
    getEvaluatedArticles(dependencies),
    TE.mapLeft(constant(noEvaluationsYet)),
  )),
  TE.chainEitherK(flow(
    paginate(pageSize, pageNumber),
    E.mapLeft(() => '<p>No such page.</p>'),
  )),
  TE.flatMap((pageOfItems) => pipe(
    pageOfItems.items,
    constructArticleViewModels(dependencies),
    TE.bimap(
      constant(troubleFetchingTryAgain),
      renderArticleCardList(pageOfItems),
    ),
  )),
  TE.toUnion,
  T.map(flow(
    toHtmlFragment,
    renderAsSection,
  )),
);
