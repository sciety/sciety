import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
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
import { toUserId, UserId } from '../../types/user-id';

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

const controls = (loggedInUser: O.Option<UserId>, listOwnerId: UserId, showControls: boolean) => (
  (showControls && O.isSome(loggedInUser) && listOwnerId === pipe(loggedInUser, O.getOrElse(constant(toUserId('0')))))
    ? O.some(toHtmlFragment('<img src="/static/images/delete.svg">'))
    : O.none
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
    RA.map(renderArticleCard(controls(loggedInUser, listOwnerId, showControls))),
    renderSavedArticles,
  )),
  TE.toUnion,
);
