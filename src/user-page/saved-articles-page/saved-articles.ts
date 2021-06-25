import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import {
  FindReviewsForArticleDoi, populateArticleViewModel,
} from './populate-article-view-model';
import { GetAllEvents, projectSavedArticleDois } from './project-saved-article-dois';
import { renderSavedArticles } from './render-saved-articles';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { UserId } from '../../types/user-id';
import { informationUnavailable } from '../static-messages';

type FetchArticle = (doi: Doi) => TE.TaskEither<unknown, {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
}>;

export type Ports = {
  getAllEvents: GetAllEvents,
  fetchArticle: FetchArticle,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

type SavedArticles = (ports: Ports) => (u: UserId) => TE.TaskEither<never, HtmlFragment>;

export const savedArticles: SavedArticles = (ports) => flow(
  projectSavedArticleDois(ports.getAllEvents),
  T.chain(TE.traverseArray(ports.fetchArticle)),
  TE.chainTaskK(T.traverseArray(populateArticleViewModel({
    findReviewsForArticleDoi: ports.findReviewsForArticleDoi,
    getLatestArticleVersionDate: getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  }))),
  TE.match(
    () => informationUnavailable,
    renderSavedArticles,
  ),
  TE.rightTask,
);
