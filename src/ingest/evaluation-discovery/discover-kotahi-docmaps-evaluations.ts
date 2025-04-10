/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';

export const discoverKotahiDocmapsEvaluations: DiscoverPublishedEvaluations = (
  ingestDays,
) => (
  dependencies,
) => TE.right({
  understood: [
    {
      publishedOn: new Date('2025-04-10T09:39:50.072Z'),
      paperExpressionDoi: '10.1101/2025.03.27.645397',
      evaluationLocator: 'hypothesis:zcPWGBC-EfCXaG9pRxlnhA',
      authors: [],
      evaluationType: 'review',
    },
    {
      publishedOn: new Date('2025-04-10T09:39:50.106Z'),
      paperExpressionDoi: '10.1101/2025.03.27.645397',
      evaluationLocator: 'hypothesis:zYPccBC-EfCbwOfTQ6xWFQ',
      authors: [],
      evaluationType: 'curation-statement',
    },
  ],
  skipped: [],
});
