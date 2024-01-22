import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleAuthors } from '../../types/article-authors';
import * as DE from '../../types/data-error';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { Dependencies } from './dependencies';
import { getLatestExpressionDate } from './get-latest-expression-date';
import { ExpressionDoi } from '../../types/expression-doi';

type FetchArticleDetails = (
  dependencies: Dependencies,
) => (expressionDoi: ExpressionDoi) => TE.TaskEither<DE.DataError, {
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
}>;

export const fetchArticleDetails: FetchArticleDetails = (
  dependencies,
) => (expressionDoi) => pipe(
  expressionDoi,
  dependencies.fetchExpressionFrontMatter,
  TE.chainW((expressionFrontMatter) => pipe(
    getLatestExpressionDate(dependencies)(expressionDoi),
    T.map((latestVersionDate) => ({
      latestVersionDate,
      authors: expressionFrontMatter.authors,
      title: expressionFrontMatter.title,
    })),
    TE.rightTask,
  )),
);
