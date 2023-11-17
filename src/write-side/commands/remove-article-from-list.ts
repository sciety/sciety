import * as t from 'io-ts';
import { articleIdCodec } from '../../types/article-id.js';
import { listIdCodec } from '../../types/list-id.js';

export const removeArticleFromListCommandCodec = t.strict({
  articleId: articleIdCodec,
  listId: listIdCodec,
});

export type RemoveArticleFromListCommand = t.TypeOf<typeof removeArticleFromListCommandCodec>;
