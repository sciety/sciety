import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { annotationTargetCodec } from '../types/annotation-target';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { htmlFragmentCodec } from '../types/html-fragment';

export const annotationCreatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('AnnotationCreated'),
  date: tt.DateFromISOString,
  content: htmlFragmentCodec,
  target: annotationTargetCodec,
});
