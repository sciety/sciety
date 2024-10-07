import * as t from 'io-ts';

export const evaluationTypeCodec = t.union([
  t.literal('review'),
  t.literal('author-response'),
  t.literal('curation-statement'),
  t.literal('not-provided'),
]);

export const evaluationTypes = <const>[
  'review',
  'author-response',
  'curation-statement',
  'not-provided',
];

export type EvaluationType = (typeof evaluationTypes)[number];
