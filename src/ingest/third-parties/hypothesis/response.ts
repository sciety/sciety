import * as t from 'io-ts';
import { annotationFromJson } from './annotation';

export const responseFromJson = t.type({
  rows: t.array(annotationFromJson),
});
