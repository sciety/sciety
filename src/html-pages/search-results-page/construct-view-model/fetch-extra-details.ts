import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { ArticleItem, GroupItem, isArticleItem } from './data-types';
import { constructGroupCardViewModel } from '../../../shared-components/group-card';
import { ArticleServer } from '../../../types/article-server';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { ItemViewModel, ViewModel } from '../view-model';
import { Queries } from '../../../shared-read-models';
import { ArticleErrorCardViewModel } from '../../../shared-components/article-card/render-article-error-card';
import {
  constructArticleCardViewModel,
  Ports as ConstructArticleCardViewModelPorts,
} from '../../../shared-components/article-card/construct-article-card-view-model';

export type Ports = Queries & ConstructArticleCardViewModelPorts & {
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
};

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

const fetchItemDetails = (
  ports: Ports,
) => (item: ArticleItem | GroupItem): TE.TaskEither<DE.DataError | ArticleErrorCardViewModel, ItemViewModel> => (
  isArticleItem(item)
    ? pipe(item.articleId, constructArticleCardViewModel(ports))
    : pipe(item.id, constructGroupCardViewModel(ports), T.of));

export type LimitedSet = {
  query: string,
  evaluatedOnly: boolean,
  category: 'articles' | 'groups',
  availableArticleMatches: number,
  availableGroupMatches: number,
  itemsToDisplay: ReadonlyArray<GroupItem | ArticleItem>,
  nextCursor: O.Option<string>,
  pageNumber: number,
  numberOfPages: number,
};

export const fetchExtraDetails = (ports: Ports) => (state: LimitedSet): T.Task<ViewModel> => pipe(
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
