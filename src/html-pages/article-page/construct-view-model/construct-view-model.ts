import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
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

const constructUserListManagement = (user: Params['user'], ports: Ports, articleId: Doi) => pipe(
  user,
  O.map(
    ({ id }) => pipe(
      ports.selectListContainingArticle(id)(articleId),
      O.fold(
        () => pipe(
          id,
          LOID.fromUserId,
          ports.selectAllListsOwnedBy,
          (lists) => lists[0],
          (list) => ({
            listId: list.id,
            listName: list.name,
            isArticleInList: false,
          }),

        ),
        (list) => ({
          listId: list.id,
          listName: list.name,
          isArticleInList: true,
        }),
      ),
    ),
  ),
);

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

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
    })),
  )),
);
