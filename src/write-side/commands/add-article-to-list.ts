import * as t from 'io-ts';
import { canonicalExpressionDoiCodec } from '../../types/expression-doi';
import { listIdCodec } from '../../types/list-id';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input';

export const addArticleToListCommandCodec = t.intersection([
  t.strict({
    expressionDoi: canonicalExpressionDoiCodec,
    listId: listIdCodec,
  }),
  t.partial({
    annotation: unsafeUserInputCodec,
  }),
]);

export type AddArticleToListCommand = t.TypeOf<typeof addArticleToListCommandCodec>;
