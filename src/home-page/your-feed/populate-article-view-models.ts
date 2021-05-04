import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow } from 'fp-ts/function';
import { ArticleViewModel } from '../../shared-components';
import { FindVersionsForArticleDoi } from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleActivity } from '../../types/article-activity';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type PopulateArticleViewModel = (articleActivity: ArticleActivity) => TO.TaskOption<ArticleViewModel>;

const populateArticleViewModel = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getArticle: GetArticle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
): PopulateArticleViewModel => (articleActivity) => TO.some(
  {
    ...articleActivity,
    latestVersionDate: O.none,
    latestActivityDate: O.some(articleActivity.latestActivityDate),
    authors: [],
    title: sanitise(toHtmlFragment('')),
  },
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
