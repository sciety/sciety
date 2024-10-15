import * as t from 'io-ts';

export const evaluationTypes = <const>{
  review: 'review',
  authorResponse: 'author-response',
  curationStatement: 'curation-statement',
  notProvided: 'not-provided',
};

export const evaluationTypeCodec = t.union([
  t.literal(evaluationTypes.review),
  t.literal(evaluationTypes.authorResponse),
  t.literal(evaluationTypes.curationStatement),
  t.literal(evaluationTypes.notProvided),
]);

type MapOfEvaluationTypes = typeof evaluationTypes;

export type EvaluationType = MapOfEvaluationTypes[keyof MapOfEvaluationTypes];
