import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { htmlFragmentCodec } from '../types/html-fragment';
import { articleIdCodec } from '../types/article-id';
import { listIdCodec } from '../types/list-id';

export const annotationCreatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('AnnotationCreated'),
  date: tt.DateFromISOString,
  content: htmlFragmentCodec,
  target: t.type({
    articleId: articleIdCodec,
    listId: listIdCodec,
  }),
});

export const articleInListAnnotatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleInListAnnotated'),
  date: tt.DateFromISOString,
  content: htmlFragmentCodec,
  articleId: articleIdCodec,
  listId: listIdCodec,
});
