import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow } from 'fp-ts/function';
import { ArticleViewModel } from '../../shared-components';
import { ArticleActivity } from '../../types/article-activity';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';

type PopulateArticleViewModel = (articleActivity: ArticleActivity) => TO.TaskOption<ArticleViewModel>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const populateArticleViewModel: PopulateArticleViewModel = (articleActivity) => TO.some(
  {
    ...articleActivity,
    latestVersionDate: O.none,
    latestActivityDate: O.some(articleActivity.latestActivityDate),
    authors: [],
    title: sanitise(toHtmlFragment('')),
  },
);

type PopulateArticleViewModelsSkippingFailures = (
  activities: ReadonlyArray<ArticleActivity>
) => T.Task<ReadonlyArray<ArticleViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = flow(
  RA.map(populateArticleViewModel),
  T.sequenceArray,
  T.map(RA.compact),
);
