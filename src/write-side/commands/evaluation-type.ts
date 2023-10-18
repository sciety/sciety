import * as t from 'io-ts';

export const evaluationTypeCodec = t.union([
  t.literal('review'),
  t.literal('author-response'),
  t.literal('curation-statement'),
  t.literal('not-provided'),
]);
