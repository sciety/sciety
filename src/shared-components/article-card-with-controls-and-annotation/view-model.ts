import * as O from 'fp-ts/Option';
import { ListId } from '../../types/list-id';
import { ViewModel as DefaultVariantViewModel } from '../paper-activity-summary-card/view-model';
import { RawUserInput } from '../../read-models/annotations/handle-event';
import { ExpressionDoi } from '../../types/expression-doi';

export type Annotation = {
  author: string,
  authorAvatarPath: string,
  content: RawUserInput,
};

export type ViewModel = {
  articleCard: DefaultVariantViewModel,
  annotation: O.Option<Annotation>,
  controls: O.Option<{
    listId: ListId,
    expressionDoi: ExpressionDoi,
    createAnnotationFormHref: O.Option<string>,
  }>,
};
