import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { AnnotationTarget, annotationTargetCodec } from '../types/annotation-target';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { generate } from '../types/event-id';
import { HtmlFragment, htmlFragmentCodec } from '../types/html-fragment';

export const annotationCreatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('AnnotationCreated'),
  date: tt.DateFromISOString,
  content: htmlFragmentCodec,
  target: annotationTargetCodec,
});

type AnnotationCreatedEvent = t.TypeOf<typeof annotationCreatedEventCodec>;

export const annotationCreated = (
  target: AnnotationTarget,
  content: HtmlFragment,
  date = new Date(),
): AnnotationCreatedEvent => ({
  id: generate(),
  type: 'AnnotationCreated',
  date,
  target,
  content,
});
