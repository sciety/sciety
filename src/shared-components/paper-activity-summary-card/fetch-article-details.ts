import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { ArticleId } from '../../types/article-id';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { Dependencies } from './dependencies';
import { getLatestExpressionDate } from './get-latest-expression-date';
import { ExpressionDoi } from '../../types/expression-doi';

type FetchArticleDetails = (
  dependencies: Dependencies,
) => (expressionDoi: ExpressionDoi) => TE.TaskEither<DE.DataError, {
  articleId: ArticleId,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
  server: ArticleServer,
}>;

export const fetchArticleDetails: FetchArticleDetails = (
  dependencies,
) => (expressionDoi) => pipe(
  new ArticleId(expressionDoi),
  dependencies.fetchArticle,
  TE.chainW(({ authors, title, server }) => pipe(
    getLatestExpressionDate(dependencies)(expressionDoi, server),
    T.map((latestVersionDate) => ({
      latestVersionDate,
      authors,
      title,
      server,
      articleId: new ArticleId(expressionDoi),
    })),
    TE.rightTask,
  )),
);
