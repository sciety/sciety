import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleAuthors } from '../../types/article-authors';
import * as DE from '../../types/data-error';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../types/expression-doi';
import { PublishingHistory } from '../../types/publishing-history';
import * as PH from '../../types/publishing-history';

type FetchArticleDetails = (
  dependencies: Dependencies,
  publishingHistory: PublishingHistory,
) => (expressionDoi: ExpressionDoi) => TE.TaskEither<DE.DataError, {
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: Date,
}>;

export const fetchArticleDetails: FetchArticleDetails = (
  dependencies,
  publishingHistory,
) => (expressionDoi) => pipe(
  expressionDoi,
  dependencies.fetchExpressionFrontMatter,
  TE.map((expressionFrontMatter) => pipe(
    publishingHistory,
    PH.getLatestExpression,
    (version) => version.publishedAt,
    (latestVersionDate) => ({
      latestVersionDate,
      authors: expressionFrontMatter.authors,
      title: expressionFrontMatter.title,
    }),
  )),
);
