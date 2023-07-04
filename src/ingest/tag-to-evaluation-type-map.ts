import { EvaluationType } from '../write-side/commands/record-evaluation';

export const tagToEvaluationTypeMap: Record<EvaluationType, ReadonlyArray<string>> = {
  'curation-statement': [
    'Summary ',
    'Summary',
    'evaluationSummary',
    'evalutationSummary',
    'scietyType:ReviewSummary',
  ],
  review: [],
  'author-response': [],
};
