import * as t from 'io-ts';

export const evaluationTypeCodec = t.union([
  t.literal('review'),
  t.literal('author-response'),
  t.literal('curation-statement'),
  t.literal('not-provided'),
]);

export const evaluationTypes = {
  review: 'review' as const,
  authorResponse: 'author-response' as const,
  curationStatement: 'curation-statement' as const,
  notProvided: 'not-provided' as const,
};

export type EvaluationType = 'review' | 'author-response' | 'curation-statement' | 'not-provided';
