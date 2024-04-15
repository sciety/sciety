import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {
  constructArticleCardWithControlsAndAnnotation,
} from '../../../../html-pages/shared-components/article-card-with-controls-and-annotation';
import { ExpressionActivity } from '../../../../types/expression-activity';
import { ListId } from '../../../../types/list-id';
import { Dependencies } from './dependencies';
import { ViewModel } from '../view-model';
import * as EDOI from '../../../../types/expression-doi';

export const toPageOfCards = (
  dependencies: Dependencies,
  listId: ListId,
) => (
  items: ReadonlyArray<ExpressionActivity>,
): T.Task<ViewModel['articles']> => pipe(
  items,
  RA.map((item) => EDOI.fromValidatedString(item.expressionDoi.value)),
  T.traverseArray(constructArticleCardWithControlsAndAnnotation(dependencies, false, listId)),
  T.map(RA.rights),
);
