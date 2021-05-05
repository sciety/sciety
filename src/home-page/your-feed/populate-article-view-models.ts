import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { ArticleViewModel } from '../../shared-components';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import {
  FindVersionsForArticleDoi,
  getLatestArticleVersionDate,
} from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleActivity } from '../../types/article-activity';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type PopulateArticleViewModel = (articleActivity: ArticleActivity) => TO.TaskOption<ArticleViewModel>;

const populateArticleViewModel = (
  getArticle: GetArticle,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
): PopulateArticleViewModel => (articleActivity) => pipe(
  articleActivity.doi,
  fetchArticleDetails(
    getLatestArticleVersionDate(findVersionsForArticleDoi),
    flow(getArticle, T.map(O.fromEither)),
  ),
  TO.map((articleDetails) => ({
    ...articleActivity,
    latestVersionDate: O.some(articleDetails.latestVersionDate),
    latestActivityDate: O.some(articleActivity.latestActivityDate),
    authors: articleDetails.authors,
    title: articleDetails.title,
  })),
);

export type GetArticle = (doi: Doi) => TE.TaskEither<unknown, {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ReadonlyArray<string>,
}>;

type PopulateArticleViewModelsSkippingFailures = (
  getArticle: GetArticle,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
) => (
  activities: ReadonlyArray<ArticleActivity>
) => T.Task<ReadonlyArray<ArticleViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  getArticle,
  findVersionsForArticleDoi,
) => flow(
  RA.map(populateArticleViewModel(
    getArticle,
    findVersionsForArticleDoi,
  )),
  T.sequenceArray,
  T.map(RA.compact),
);
