import * as t from 'io-ts';
import { articleIdCodec } from '../../types/article-id';
import { listIdCodec } from '../../types/list-id';

export const removeArticleFromListCommandCodec = t.strict({
  articleId: articleIdCodec,
  listId: listIdCodec,
});

export type RemoveArticleFromListCommand = t.TypeOf<typeof removeArticleFromListCommandCodec>;
