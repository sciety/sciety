import * as t from 'io-ts';
import { DoiFromString } from '../../types/article-id';
import { listIdCodec } from '../../types/list-id';

export const removeArticleFromListCommandCodec = t.strict({
  articleId: DoiFromString,
  listId: listIdCodec,
});

export type RemoveArticleFromListCommand = t.TypeOf<typeof removeArticleFromListCommandCodec>;
