import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
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
import { DomainEvent } from '../../domain-events';
import {
  FindVersionsForArticleDoi,
  getLatestArticleVersionDate,
  renderArticleCard,
} from '../../shared-components/article-card';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import { PageOfItems, paginate } from '../../shared-components/paginate';
import { paginationControls } from '../../shared-components/pagination-controls';
import { getGroupIdsFollowedBy } from '../../shared-read-models/followings';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  fetchArticle: GetArticle,
  getAllEvents: GetAllEvents,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
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
  ports.getAllEvents,
  T.map(getGroupIdsFollowedBy(uid)),
  T.map(RNEA.fromReadonlyArray),
  T.map(E.fromOption(constant('no-groups-followed'))),
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
      getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
      ports.fetchArticle,
    ),
  ),
  T.map(RNEA.fromReadonlyArray),
  T.map(E.fromOption(constant('all-articles-failed'))),
);

const renderArticleCardList = (pageofItems: PageOfItems<unknown>) => flow(
  RNEA.map(renderArticleCard(O.none)),
  RNEA.map((card) => `<li class="my-feed__list_item">${card}</li>`),
  (cards) => `
    <p class="my-feed-page-numbers">
      Showing page ${pageofItems.pageNumber} of ${pageofItems.numberOfPages}<span class="visually-hidden"> pages of articles that have been evaluated by groups that you follow.</span>
    </p>
    <ol class="my-feed__list" role="list">${cards.join('')}</ol>
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
  TE.chain(flow(
    getFollowedGroups(ports),
    TE.mapLeft(constant(followSomething)),
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
