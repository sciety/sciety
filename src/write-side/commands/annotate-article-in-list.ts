import * as t from 'io-ts';
import { articleIdCodec } from '../../types/article-id';
import { listIdCodec } from '../../types/list-id';
import { inputFieldNames } from '../../standards';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input';

export const annotateArticleInListCommandCodec = t.type({
  [inputFieldNames.content]: unsafeUserInputCodec,
  [inputFieldNames.articleId]: articleIdCodec,
  [inputFieldNames.listId]: listIdCodec,
});

export type AnnotateArticleInListCommand = t.TypeOf<typeof annotateArticleInListCommandCodec>;
