import * as O from 'fp-ts/Option';
import { RawUserInput } from '../../..';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { ListId } from '../../../../types/list-id';
import { ViewModel as DefaultVariantViewModel } from '../paper-activity-summary-card/view-model';

export type Annotation = {
  author: string,
  authorAvatarSrc: string,
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
