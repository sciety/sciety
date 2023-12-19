import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { ArticleServer } from '../../types/article-server';
import { ExpressionDoi } from '../../types/expression-doi';
import { Dependencies } from './dependencies';

type GetLatestExpressionDate = (
  dependencies: Dependencies,
) => (expressionDoi: ExpressionDoi, server: ArticleServer) => TO.TaskOption<Date>;

export const getLatestExpressionDate: GetLatestExpressionDate = (
  dependencies,
) => (
  expressionDoi, server,
) => pipe(
  dependencies.findVersionsForArticleDoi(expressionDoi, server),
  T.map(O.map(flow(
    RNEA.last,
    (version) => version.publishedAt,
  ))),
);
