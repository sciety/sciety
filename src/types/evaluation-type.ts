export const evaluationTypes = <const> [
  'review',
  'author-response',
  'curation-statement',
  'not-provided',
];

export type EvaluationType = typeof evaluationTypes[number];
