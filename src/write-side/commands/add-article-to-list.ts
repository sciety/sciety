import * as t from 'io-ts';
import { inputFieldNames } from '../../standards/input-field-names';
import { canonicalExpressionDoiCodec } from '../../types/expression-doi';
import { listIdCodec } from '../../types/list-id';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input';

export const addArticleToListCommandCodec = t.intersection([
  t.strict({
    [inputFieldNames.expressionDoi]: canonicalExpressionDoiCodec,
    listId: listIdCodec,
  }),
  t.partial({
    [inputFieldNames.annotationContent]: unsafeUserInputCodec,
  }),
]);

export type AddArticleToListCommand = t.TypeOf<typeof addArticleToListCommandCodec>;
