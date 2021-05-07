import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { followedGroups } from './followed-groups';
import { followedGroupsActivities } from './followed-groups-activities';
import { GetArticle, populateArticleViewModelsSkippingFailures } from './populate-article-view-models';
import {
  followSomething,
  noEvaluationsYet, troubleFetchingTryAgain,
  welcomeMessage,
} from './static-messages';
import { renderArticleCard } from '../../shared-components';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import {
  FindVersionsForArticleDoi,
  getLatestArticleVersionDate,
} from '../../shared-components/article-card/get-latest-article-version-date';
import { DomainEvent } from '../../types/domain-events';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

// ts-unused-exports:disable-next-line
export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  fetchArticle: GetArticle,
  getAllEvents: GetAllEvents,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

// ts-unused-exports:disable-next-line
export const feedTitle = 'Recently evaluated by groups you follow';

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

type YourFeed = (ports: Ports) => (
  userId: O.Option<UserId>,
) => T.Task<HtmlFragment>;

export const yourFeed: YourFeed = (ports) => flow(
  TE.fromOption(constant(welcomeMessage)),
  TE.chain(flow(
    getFollowedGroups(ports),
    TE.mapLeft(constant(followSomething)),
  )),
  TE.chain(flow(
    getEvaluatedArticles(ports),
    TE.mapLeft(constant(noEvaluationsYet)),
  )),
  TE.chain(flow(
    populateArticleViewModelsSkippingFailures(
      fetchArticleDetails(
        getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
        flow(ports.fetchArticle, T.map(O.fromEither)),
      ),
    ),
    T.map(RNEA.fromReadonlyArray),
    T.map(E.fromOption(constant(troubleFetchingTryAgain))),
  )),
  TE.map(RA.map(renderArticleCard)),
  TE.map(RA.map((activity) => `<li class="your-feed__list_item">${activity}</li>`)),
  TE.map((renderedActivities) => `
    <ul class="your-feed__list" role="list">${renderedActivities.join('')}</ul>
  `),
  TE.toUnion,
  T.map(flow(
    toHtmlFragment,
    renderAsSection,
  )),
);
