import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { articleIdCodec } from '../types/article-id.js';
import { listIdCodec } from '../types/list-id.js';
import { unsafeUserInputCodec } from '../types/unsafe-user-input.js';

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
