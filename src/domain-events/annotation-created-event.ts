import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { generate } from '../types/event-id';
import { HtmlFragment } from '../types/html-fragment';

const targetCodec = t.type({
  articleId: DoiFromString,
  listId: ListIdFromString,
});

type Target = t.TypeOf<typeof targetCodec>;

export const annotationCreatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('AnnotationCreated'),
  date: tt.DateFromISOString,
  content: t.string,
  target: targetCodec,
});

export type AnnotationCreatedEvent = t.TypeOf<typeof annotationCreatedEventCodec>;

export const isAnnotationCreatedEvent = (event: { type: string }):
  event is AnnotationCreatedEvent => event.type === 'AnnotationCreated';

export const annotationCreated = (
  target: Target,
  content: HtmlFragment,
  date = new Date(),
): AnnotationCreatedEvent => ({
  id: generate(),
  type: 'AnnotationCreated',
  date,
  target,
  content,
});
