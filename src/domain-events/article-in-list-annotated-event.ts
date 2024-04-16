import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { listIdCodec } from '../types/list-id';
import { unsafeUserInputCodec } from '../types/unsafe-user-input';

export const annotationCreatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('AnnotationCreated'),
  date: tt.DateFromISOString,
  content: unsafeUserInputCodec,
  target: t.type({
    articleId: articleIdCodec,
    listId: listIdCodec,
  }),
});

export const articleInListAnnotatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleInListAnnotated'),
  date: tt.DateFromISOString,
  content: unsafeUserInputCodec,
  articleId: articleIdCodec,
  listId: listIdCodec,
});
