import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import {
  FetchArticle,
  GetUserDetails,
  groupEvaluatedArticleCard,
  groupEvaluatedMultipleArticlesCard,
  scietyFeedCard,
  userFollowedAGroupCard,
  userSavedArticleToAListCard,
} from './cards';
import {
  collapseCloseEvents,
  CollapsedEvent,
  isCollapsedGroupEvaluatedArticle,
  isCollapsedGroupEvaluatedMultipleArticles,
} from './collapse-close-events';
import { paginate } from './paginate';
import { DomainEvent, isGroupEvaluatedArticleEvent, isUserSavedArticleEvent } from '../domain-events';
import { isUserFollowedEditorialCommunityEvent } from '../domain-events/type-guards';
import { templateListItems } from '../shared-components/list-items';
import { paginationControls } from '../shared-components/pagination-controls';
import { supplementaryCard } from '../shared-components/supplementary-card';
import { supplementaryInfo } from '../shared-components/supplementary-info';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type ViewModel = {
  cards: ReadonlyArray<HtmlFragment>,
  nextPage: O.Option<number>,
  numberOfPages: number,
  pageNumber: number,
};

const supplementaryItems = [
  supplementaryCard(
    'What is the Sciety feed?',
    toHtmlFragment(`
      <p>
        A feed of events that have happened across the Sciety network. Click on a card to find out more. You can build <a href="/my-feed">your own feed</a> of events relevant to you by following specific groups.
      </p>
    `),
  ),
];

const renderContent = (viewModel: ViewModel) => toHtmlFragment(`
  <header class="page-header">
    <h1>Sciety Feed</h1>
  </header>
  <section>
    <p class="sciety-feed-page-numbers">
      Showing page ${viewModel.pageNumber} of ${viewModel.numberOfPages}<span class="visually-hidden"> pages of activity</span>
    </p>
    <ol class="sciety-feed-list">
      ${templateListItems(viewModel.cards, 'sciety-feed-list__item')}
    </ol>
    ${pipe(
    viewModel.nextPage,
    O.fold(
      () => '',
      (page) => paginationControls(`/sciety-feed?page=${page}`),
    ),
  )}
  </section>
  ${supplementaryInfo(supplementaryItems, 'supplementary-info--sciety-feed')}
`);

export const scietyFeedCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
});

type GetGroup = (id: GroupId) => TO.TaskOption<Group>;

type Ports = {
  fetchArticle: FetchArticle,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getGroup: GetGroup,
  getUserDetails: GetUserDetails,
};

type Params = t.TypeOf<typeof scietyFeedCodec>;

const eventCard = (
  getGroup: GetGroup,
  fetchArticle: FetchArticle,
  getUserDetails: GetUserDetails,
) => (
  event: DomainEvent | CollapsedEvent,
): TE.TaskEither<DE.DataError, HtmlFragment> => {
  if (isCollapsedGroupEvaluatedMultipleArticles(event)) {
    return pipe(
      event,
      groupEvaluatedMultipleArticlesCard(getGroup),
      TE.map(scietyFeedCard),
    );
  }

  if (isCollapsedGroupEvaluatedArticle(event) || isGroupEvaluatedArticleEvent(event)) {
    return pipe(
      event,
      groupEvaluatedArticleCard(getGroup, fetchArticle),
      TE.map(scietyFeedCard),
    );
  }

  if (isUserSavedArticleEvent(event)) {
    return pipe(
      event,
      userSavedArticleToAListCard(getUserDetails),
      TE.map(scietyFeedCard),
    );
  }

  if (isUserFollowedEditorialCommunityEvent(event)) {
    return pipe(
      event,
      userFollowedAGroupCard(getUserDetails, getGroup),
      TE.map(scietyFeedCard),
    );
  }

  return TE.left(DE.unavailable);
};

export const scietyFeedPage = (
  ports: Ports,
) => (pageSize: number) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  ports.getAllEvents,
  T.map(RA.filter(
    (event) => isGroupEvaluatedArticleEvent(event)
      || isUserSavedArticleEvent(event)
      || isUserFollowedEditorialCommunityEvent(event),
  )),
  T.map(RA.reverse),
  T.map(collapseCloseEvents),
  T.map(paginate(pageSize, params.page)),
  TE.chain(({ items, ...rest }) => pipe(
    items,
    TE.traverseArray(eventCard(ports.getGroup, ports.fetchArticle, ports.getUserDetails)),
    TE.map((cards) => ({ cards, ...rest })),
  )),
  TE.bimap(
    (e) => ({ type: e, message: toHtmlFragment('We couldn\'t find that information.') }),
    (viewModel) => ({
      title: 'Sciety Feed',
      content: renderContent(viewModel),
    }),
  ),
);
