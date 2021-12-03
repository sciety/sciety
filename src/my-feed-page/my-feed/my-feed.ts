import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { followedGroups } from './followed-groups';
import { followedGroupsActivities } from './followed-groups-activities';
import { GetArticle, populateArticleViewModelsSkippingFailures } from './populate-article-view-models';
import {
  feedTitle,
  followSomething,
  noEvaluationsYet,
  troubleFetchingTryAgain,
} from './static-content';
import { DomainEvent } from '../../domain-events';
import { renderArticleCard } from '../../shared-components/article-card';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import {
  FindVersionsForArticleDoi,
  getLatestArticleVersionDate,
} from '../../shared-components/article-card/get-latest-article-version-date';
import { paginate } from '../../shared-components/paginate';
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
  T.map((events) => followedGroups(events)(uid)),
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

const renderArticleCardList = flow(
  RNEA.map(renderArticleCard(O.none)),
  RNEA.map((card) => `<li class="my-feed__list_item">${card}</li>`),
  (cards) => `<ul class="my-feed__list" role="list">${cards.join('')}</ul>`,
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
    E.mapLeft(() => 'No such page.'),
  )),
  TE.map(({ items }) => items),
  TE.chain(flow(
    constructArticleViewModels(ports),
    TE.mapLeft(constant(troubleFetchingTryAgain)),
  )),
  TE.map(renderArticleCardList),
  TE.toUnion,
  T.map(flow(
    toHtmlFragment,
    renderAsSection,
  )),
);
