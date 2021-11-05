import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { ArticleViewModel } from '../../shared-components/article-card';
import { ArticleActivity } from '../../types/article-activity';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type PopulateArticleViewModel = (articleActivity: ArticleActivity) => TO.TaskOption<ArticleViewModel>;
type FetchArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  latestVersionDate: O.Option<Date>,
}>;

const populateArticleViewModel = (
  fetchArticleDetails: FetchArticleDetails,
): PopulateArticleViewModel => (articleActivity) => pipe(
  articleActivity.doi,
  fetchArticleDetails,
  TO.fromTaskEither,
  TO.map((articleDetails) => ({
    ...articleActivity,
    latestVersionDate: articleDetails.latestVersionDate,
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
  fetchArticleDetails: FetchArticleDetails,
) => (
  activities: ReadonlyArray<ArticleActivity>
) => T.Task<ReadonlyArray<ArticleViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  fetchArticleDetails,
) => flow(
  RA.map(populateArticleViewModel(
    fetchArticleDetails,
  )),
  T.sequenceArray,
  T.map(RA.compact),
);
