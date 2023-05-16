import * as t from 'io-ts';
import { annotationTargetCodec } from '../types/annotation-target';
import { htmlFragmentCodec } from '../types/html-fragment';
import { eventBaseCodec } from './event-base';

export const annotationCreatedEventCodec = t.type({
  ...eventBaseCodec('AnnotationCreated'),
  content: htmlFragmentCodec,
  target: annotationTargetCodec,
});
