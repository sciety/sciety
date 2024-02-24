import * as t from 'io-ts';
import { articleIdCodec } from '../../types/article-id.js';
import { listIdCodec } from '../../types/list-id.js';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input.js';

export const addArticleToListCommandCodec = t.intersection([
  t.strict({
    articleId: articleIdCodec,
    listId: listIdCodec,
  }),
  t.partial({
    annotation: unsafeUserInputCodec,
  }),
]);

export type AddArticleToListCommand = t.TypeOf<typeof addArticleToListCommandCodec>;
