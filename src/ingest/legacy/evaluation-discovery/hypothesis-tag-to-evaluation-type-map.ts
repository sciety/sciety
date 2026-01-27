type EvaluationType = 'curation-statement' | 'author-response' | 'review';

export const tagToEvaluationTypeMap: Record<EvaluationType, ReadonlyArray<string>> = {
  'curation-statement': [
    'Summary ',
    'Summary',
    'evaluationSummary',
    'evalutationSummary',
    'scietyType:ReviewSummary',
  ],
  review: [
    'Review4',
    'scietyType:PeerReview 3',
    'scietyType:PeerReview 2',
    'scietyType:PeerReview 1',
    'Review 4',
    'InRevision',
    'Review3',
    'Review2',
    'Review1',
    'PeerReviewed',
    'Review 3',
    'scietyType:PeerReview',
    'Review 2',
    'Review 1',
    'peerReview',
  ],
  'author-response': [
    'Author Response',
    'AuthorResponse',
    'scietyType:AuthorResponse',
    'scietyType:AuthorRespose',
  ],
};
