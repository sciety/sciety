import * as E from 'fp-ts/Either';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { followedGroupsActivities } from './followed-groups-activities';
import { GetArticle, populateArticleViewModelsSkippingFailures } from './populate-article-view-models';
import {
  feedTitle,
  followSomething,
  noEvaluationsYet,
  troubleFetchingTryAgain,
} from './static-content';
import {
  Ports as ArticleCardPorts,
  getLatestArticleVersionDate,
  renderArticleCard,
} from '../../../shared-components/article-card';
import { fetchArticleDetails } from '../../../shared-components/article-card/fetch-article-details';
import { PageOfItems, paginate } from '../../../shared-components/paginate';
import { paginationControls } from '../../../shared-components/pagination-controls';
import { GroupId } from '../../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { UserId } from '../../../types/user-id';
import { GetAllEvents } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';

export type Ports = ArticleCardPorts & {
  fetchArticle: GetArticle,
  getAllEvents: GetAllEvents,
  getGroupsFollowedBy: Queries['getGroupsFollowedBy'],
};

const renderAsSection = (contents: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <section>
    <h2>
      ${feedTitle}
    </h2>
    ${contents}
  </section>
`);

const getFollowedGroups = (ports: Ports) => (uid: UserId) => pipe(
  ports.getGroupsFollowedBy(uid),
  RNEA.fromReadonlyArray,
  E.fromOption(constant('no-groups-followed')),
);

const getEvaluatedArticles = (ports: Ports) => (groups: ReadonlyArray<GroupId>) => pipe(
  ports.getAllEvents,
  T.map((events) => followedGroupsActivities(events)(groups)),
  T.map(RNEA.fromReadonlyArray),
  T.map(E.fromOption(constant('no-groups-evaluated'))),
);

const constructArticleViewModels = (ports: Ports) => flow(
  populateArticleViewModelsSkippingFailures(
    fetchArticleDetails(
      getLatestArticleVersionDate(ports),
      ports.fetchArticle,
    ),
  ),
  T.map(RNEA.fromReadonlyArray),
  T.map(E.fromOption(constant('all-articles-failed'))),
);

const renderArticleCardList = (pageofItems: PageOfItems<unknown>) => flow(
  RNEA.map(renderArticleCard),
  RNEA.map((card) => `<li class="my-feed__list_item">${card}</li>`),
  (cards) => `
    <p class="my-feed-page-numbers">
      Showing page <b>${pageofItems.pageNumber}</b> of <b>${pageofItems.numberOfPages}</b><span class="visually-hidden"> pages of articles that have been evaluated by groups that you follow.</span>
    </p>
    <ol class="card-list" role="list">${cards.join('')}</ol>
    ${paginationControls('/my-feed?', pageofItems.nextPage)}`,
);

type YourFeed = (ports: Ports) => (
  userId: UserId,
  pageSize: number,
  pageNumber: number,
) => T.Task<HtmlFragment>;

export const myFeed: YourFeed = (ports) => (userId, pageSize, pageNumber) => pipe(
  userId,
  TE.right,
  TE.chainEitherK(flow(
    getFollowedGroups(ports),
    E.mapLeft(constant(followSomething)),
  )),
  TE.chain(flow(
    getEvaluatedArticles(ports),
    TE.mapLeft(constant(noEvaluationsYet)),
  )),
  TE.chainEitherK(flow(
    paginate(pageSize, pageNumber),
    E.mapLeft(() => '<p>No such page.</p>'),
  )),
  TE.chain((pageOfItems) => pipe(
    pageOfItems.items,
    constructArticleViewModels(ports),
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
