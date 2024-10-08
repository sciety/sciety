import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ViewModel, UnrecoverableError } from './view-model';
import { Queries } from '../../../read-models';
import { ExternalQueries } from '../../../third-parties';
import { DataError } from '../../../types/data-error';
import * as DE from '../../../types/data-error';
import { ExpressionDoi } from '../../../types/expression-doi';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';

export type Dependencies = Queries & ExternalQueries;

const getArticleTitle = (dependencies: Dependencies, expressionDoi: ExpressionDoi) => pipe(
  expressionDoi,
  dependencies.fetchExpressionFrontMatter,
  TE.map((frontMatter) => frontMatter.title),
);

const getListName = (dependencies: Dependencies, listId: ListId) => pipe(
  listId,
  dependencies.lookupList,
  O.map((list) => list.name),
  E.fromOption(() => DE.notFound),
  T.of,
);

export const constructViewModel = (
  expressionDoi: ExpressionDoi,
  listId: ListId,
  dependencies: Dependencies,
  unrecoverableError?: UnrecoverableError,
): TE.TaskEither<DataError, ViewModel> => pipe(
  {
    articleTitle: getArticleTitle(dependencies, expressionDoi),
    listName: getListName(dependencies, listId),
  },
  sequenceS(TE.ApplyPar),
  TE.map((partial) => ({
    ...partial,
    expressionDoi,
    listId,
    pageHeading: toHtmlFragment('Share your thoughts'),
    unrecoverableError: O.fromNullable(unrecoverableError),
  })),
);
