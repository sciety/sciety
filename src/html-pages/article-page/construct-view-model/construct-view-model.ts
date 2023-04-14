import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { feedSummary } from './feed-summary';
import {
  getArticleFeedEventsByDateDescending,
  Ports as GetArticleFeedEventsPorts,
} from './get-article-feed-events';
import { ArticleAuthors } from '../../../types/article-authors';
import { ArticleServer } from '../../../types/article-server';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment';
import { ViewModel } from '../view-model';
import { UserId } from '../../../types/user-id';
import { SelectListContainingArticle, SelectAllListsOwnedBy } from '../../../shared-ports';
import * as LOID from '../../../types/list-owner-id';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { ListId } from '../../../types/list-id';

export type Params = {
  doi: Doi,
  user: O.Option<{ id: UserId }>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  server: ArticleServer,
  authors: ArticleAuthors,
}>;

export type Ports = GetArticleFeedEventsPorts & {
  selectListContainingArticle: SelectListContainingArticle,
  fetchArticle: GetArticleDetails,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

const constructUserListManagement = (user: Params['user'], ports: Ports, articleId: Doi) => pipe(
  user,
  O.map(
    ({ id }) => pipe(
      ports.selectListContainingArticle(id)(articleId),
      O.foldW(
        () => pipe(
          id,
          LOID.fromUserId,
          ports.selectAllListsOwnedBy,
          sortByDefaultListOrdering,
          RA.map((list) => ({
            listId: list.id,
            listName: list.name,
          })),
          (lists) => E.left({ lists }),
        ),
        (list) => E.right({
          listId: list.id,
          listName: list.name,
        }),
      ),
    ),
  ),
);

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.fetchArticle(params.doi),
  TE.chainW((articleDetails) => pipe(
    getArticleFeedEventsByDateDescending(ports)(
      params.doi, articleDetails.server, pipe(params.user, O.map(({ id }) => id)),
    ),
    TE.rightTask,
    TE.map((feedItemsByDateDescending) => ({
      ...articleDetails,
      userListManagement: constructUserListManagement(params.user, ports, params.doi),
      fullArticleUrl: `https://doi.org/${params.doi.value}`,
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
      listedIn: [{
        listId: 'list-id-placeholder' as ListId,
        listName: 'List name placeholder',
      }],
    })),
  )),
);
