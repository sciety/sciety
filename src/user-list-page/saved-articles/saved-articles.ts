import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import {
  FindReviewsForArticleDoi, populateArticleViewModel,
} from './populate-article-view-model';
import { renderSavedArticles } from './render-saved-articles';
import { informationUnavailable, noSavedArticles } from './static-messages';
import { renderArticleCard } from '../../shared-components/article-card';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { UserId } from '../../types/user-id';

type FetchArticle = (doi: Doi) => TE.TaskEither<unknown, {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
}>;

export type Ports = {
  fetchArticle: FetchArticle,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

type SavedArticles = (ports: Ports) => (
  dois: ReadonlyArray<Doi>,
  loggedInUser: O.Option<UserId>,
  listOwnerId: UserId,
  showControls: boolean,
) => T.Task<HtmlFragment>;

const controls = (loggedInUserId: O.Option<UserId>, listOwnerId: UserId, showControls: boolean, articleId: Doi) => pipe(
  loggedInUserId,
  O.filter(() => showControls),
  O.filter((userId) => userId === listOwnerId),
  O.map(() => toHtmlFragment(`<form method="post" action="/unsave-article"><input type="hidden" name="articleid" value="${articleId.value}"><button class="saved-articles-control"><img src="/static/images/delete.svg" alt="Remove this article from the list"></button></form>`)),
);

export const savedArticles: SavedArticles = (ports) => (dois, loggedInUser, listOwnerId, showControls) => pipe(
  dois,
  RNEA.fromReadonlyArray,
  TE.fromOption(() => noSavedArticles),
  TE.chainW(flow(
    TE.traverseArray(ports.fetchArticle),
    TE.mapLeft(() => informationUnavailable),
  )),
  TE.chainTaskK(
    T.traverseArray(populateArticleViewModel({
      findReviewsForArticleDoi: ports.findReviewsForArticleDoi,
      getLatestArticleVersionDate: getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
    })),
  ),
  TE.map(flow(
    RA.map((articleViewModel) => renderArticleCard(
      controls(loggedInUser, listOwnerId, showControls, articleViewModel.doi),
    )(articleViewModel)),
    renderSavedArticles,
  )),
  TE.toUnion,
);
