import * as t from 'io-ts';

export const evaluationTypeCodec = t.union([
  t.literal('review'),
  t.literal('author-response'),
  t.literal('curation-statement'),
  t.literal('not-provided'),
]);

export const evaluationTypes = <const>{
  review: 'review',
  authorResponse: 'author-response',
  curationStatement: 'curation-statement',
  notProvided: 'not-provided',
};

type MapOfEvaluationTypes = typeof evaluationTypes;

export type EvaluationType = MapOfEvaluationTypes[keyof MapOfEvaluationTypes];
