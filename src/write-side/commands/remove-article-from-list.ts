import * as t from 'io-ts';
import { canonicalExpressionDoiCodec } from '../../types/expression-doi';
import { listIdCodec } from '../../types/list-id';

export const removeArticleFromListCommandCodec = t.strict({
  articleId: canonicalExpressionDoiCodec,
  listId: listIdCodec,
});

export type RemoveArticleFromListCommand = t.TypeOf<typeof removeArticleFromListCommandCodec>;
