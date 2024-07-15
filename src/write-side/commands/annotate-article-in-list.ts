import * as t from 'io-ts';
import { unsafeAnnotationContentCodec } from './unsafe-annotation-content';
import { inputFieldNames } from '../../standards';
import { articleIdCodec } from '../../types/article-id';
import { listIdCodec } from '../../types/list-id';

export const annotateArticleInListCommandCodec = t.type({
  [inputFieldNames.annotationContent]: unsafeAnnotationContentCodec,
  [inputFieldNames.articleId]: articleIdCodec,
  [inputFieldNames.listId]: listIdCodec,
}, 'annotateArticleInListCommandCodec');

export type AnnotateArticleInListCommand = t.TypeOf<typeof annotateArticleInListCommandCodec>;
