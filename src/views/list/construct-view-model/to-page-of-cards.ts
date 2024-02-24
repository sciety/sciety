import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {
  constructArticleCardWithControlsAndAnnotation,
} from '../../../shared-components/article-card-with-controls-and-annotation/index.js';
import { ExpressionActivity } from '../../../types/expression-activity.js';
import { ListId } from '../../../types/list-id.js';
import { Dependencies } from './dependencies.js';
import { ViewModel } from '../view-model.js';
import * as EDOI from '../../../types/expression-doi.js';

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
