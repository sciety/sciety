import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { ArticleItem, GroupItem, isArticleItem } from './data-types';
import { ItemViewModel, SearchResults } from './render-search-results';
import { populateGroupViewModel, Ports as PopulateGroupViewModelPorts } from '../shared-components/group-card/populate-group-view-model';
import { getActivityForDoi } from '../shared-read-models/article-activity';
import { getEvaluationsForDoi } from '../shared-read-models/evaluations';
import { ArticleServer } from '../types/article-server';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';

export type Ports = PopulateGroupViewModelPorts & {
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
};

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

const populateArticleViewModel = (
  ports: Ports,
) => (item: ArticleItem) => pipe(
  ports.getAllEvents,
  T.map(getEvaluationsForDoi(item.doi)),
  T.chain(flow(
    (reviews) => ({
      latestVersionDate: ports.getLatestArticleVersionDate(item.doi, item.server),
      latestActivityDate: pipe(
        ports.getAllEvents,
        T.map(getActivityForDoi(item.doi)),
        T.map((activity) => activity.latestActivityDate),
      ),
      evaluationCount: T.of(reviews.length),
    }),
    sequenceS(T.ApplyPar),
  )),
  T.map(({ latestVersionDate, latestActivityDate, evaluationCount }) => ({
    ...item,
    latestVersionDate,
    latestActivityDate,
    evaluationCount,
  })),
  TE.rightTask,
);

const fetchItemDetails = (
  ports: Ports,
) => (item: ArticleItem | GroupItem): TE.TaskEither<DE.DataError, ItemViewModel> => (
  isArticleItem(item)
    ? pipe(item, populateArticleViewModel(ports))
    : pipe(item.id, populateGroupViewModel(ports)));

export type LimitedSet = {
  query: string,
  category: string,
  availableArticleMatches: number,
  availableGroupMatches: number,
  itemsToDisplay: ReadonlyArray<GroupItem | ArticleItem>,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

export const fetchExtraDetails = (ports: Ports) => (state: LimitedSet): T.Task<SearchResults> => pipe(
  state.itemsToDisplay,
  T.traverseArray(fetchItemDetails(ports)),
  T.map(flow(
    RA.rights,
    (itemsToDisplay) => ({
      ...state,
      itemsToDisplay,
    }),
  )),
);
