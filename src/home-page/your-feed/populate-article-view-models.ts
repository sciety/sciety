import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow } from 'fp-ts/function';
import { ArticleViewModel } from '../../shared-components';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type PopulateArticleViewModel = (articleActivity: ArticleActivity) => TO.TaskOption<ArticleViewModel>;

type GetArticleDetails = (doi: Doi) => TO.TaskOption<{
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  latestVersionDate: Date,
}>;

const populateArticleViewModel = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getArticleDetails: GetArticleDetails,
): PopulateArticleViewModel => (articleActivity) => TO.some(
  {
    ...articleActivity,
    latestVersionDate: O.none,
    latestActivityDate: O.some(articleActivity.latestActivityDate),
    authors: [],
    title: sanitise(toHtmlFragment('')),
  },
);

type PopulateArticleViewModelsSkippingFailures = (
  getArticleDetails: GetArticleDetails,
) => (
  activities: ReadonlyArray<ArticleActivity>
) => T.Task<ReadonlyArray<ArticleViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  getArticleDetails,
) => flow(
  RA.map(populateArticleViewModel(getArticleDetails)),
  T.sequenceArray,
  T.map(RA.compact),
);
