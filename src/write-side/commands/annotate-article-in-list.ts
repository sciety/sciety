import * as t from 'io-ts';
import { articleIdCodec } from '../../types/article-id.js';
import { listIdCodec } from '../../types/list-id.js';
import { inputFieldNames } from '../../standards/input-field-names.js';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input.js';

export const annotateArticleInListCommandCodec = t.type({
  [inputFieldNames.annotationContent]: unsafeUserInputCodec,
  [inputFieldNames.articleId]: articleIdCodec,
  [inputFieldNames.listId]: listIdCodec,
});

export type AnnotateArticleInListCommand = t.TypeOf<typeof annotateArticleInListCommandCodec>;
