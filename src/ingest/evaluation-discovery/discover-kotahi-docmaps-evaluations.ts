/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { decodeAndReportFailures } from './decode-and-report-failures';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';

const url = 'https://kotahi-server-test.fly.dev/api/docmap/group_id/bcdf0f70-1b32-4aa8-9a9e-84265b23a30d/doi/10.1101/2025.03.27.645397';

const kotahiResponseCodec = t.strict({
  steps: t.strict({
    '_:b0': t.strict({
      inputs: t.readonlyArray(
        t.strict({
          doi: t.string,
        }),
      ),
      actions: t.readonlyArray(
        t.strict({
          outputs: t.readonlyArray(
            t.strict({
              type: t.string,
              content: t.readonlyArray(
                t.strict({
                  url: t.string,
                }),
              ),
              published: t.string,
            }),
          ),
        }),
      ),
    }),
  }),
}, 'kotahiResponseCodec');

export const discoverKotahiDocmapsEvaluations: DiscoverPublishedEvaluations = (
  ingestDays,
) => (
  dependencies,
) => pipe(
  dependencies.fetchData<string>(url),
  TE.chainEitherK(decodeAndReportFailures(kotahiResponseCodec)),
  TE.map((retrievedResponse) => ({
    understood: [
      {
        publishedOn: new Date('2025-04-10T09:39:50.072Z'),
        paperExpressionDoi: retrievedResponse.steps['_:b0'].inputs[0].doi,
        evaluationLocator: 'hypothesis:zcPWGBC-EfCXaG9pRxlnhA',
        authors: [],
        evaluationType: 'review',
      },
      {
        publishedOn: new Date('2025-04-10T09:39:50.106Z'),
        paperExpressionDoi: retrievedResponse.steps['_:b0'].inputs[0].doi,
        evaluationLocator: 'hypothesis:zYPccBC-EfCbwOfTQ6xWFQ',
        authors: [],
        evaluationType: 'curation-statement',
      },
    ],
    skipped: [],
  })),
);
