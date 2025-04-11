/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';

const url = 'https://kotahi-server-test.fly.dev/api/docmap/group_id/bcdf0f70-1b32-4aa8-9a9e-84265b23a30d/doi/10.1101/2025.03.27.645397';

export const discoverKotahiDocmapsEvaluations: DiscoverPublishedEvaluations = (
  ingestDays,
) => (
  dependencies,
) => pipe(
  dependencies.fetchData<string>(url),
  TE.map((retrievedResponse) => ({
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
  })),
);
