import * as t from 'io-ts';
import { annotationCodec } from './annotation';

export const hypothesisResponseCodec = t.type({
  rows: t.array(annotationCodec),
}, 'hypothesisResponseCodec');
