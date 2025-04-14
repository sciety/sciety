/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { decodeAndReportFailures } from './decode-and-report-failures';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';

const url = 'https://kotahi-server-test.fly.dev/api/docmap/group_id/bcdf0f70-1b32-4aa8-9a9e-84265b23a30d/doi/10.1101/2025.03.27.645397';

const actionCodec = t.strict({
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
});

const stepCodec = t.strict({
  inputs: t.readonlyArray(
    t.strict({
      doi: t.string,
    }),
  ),
  actions: t.readonlyArray(actionCodec),
});

const kotahiResponseCodec = t.strict({
  steps: t.strict({
    '_:b0': stepCodec,
  }),
}, 'kotahiResponseCodec');

const buildEvaluationLocatorFromHypothesisUrl = (hypothesisUrl: string) => {
  const regex = /https:\/\/hypothes\.is\/a\//;
  return hypothesisUrl.replace(regex, 'hypothesis:');
};

export const discoverKotahiDocmapsEvaluations: DiscoverPublishedEvaluations = (
  ingestDays,
) => (
  dependencies,
) => pipe(
  dependencies.fetchData<string>(url),
  TE.chainEitherK(decodeAndReportFailures(kotahiResponseCodec)),
  TE.map((decodedResponse) => decodedResponse.steps['_:b0']),
  TE.map((relevantStep) => ({
    understood: [
      {
        publishedOn: new Date(relevantStep.actions[0].outputs[0].published),
        paperExpressionDoi: relevantStep.inputs[0].doi,
        evaluationLocator: buildEvaluationLocatorFromHypothesisUrl(relevantStep.actions[0].outputs[0].content[0].url),
        authors: [],
        evaluationType: 'review',
      },
      {
        publishedOn: new Date(relevantStep.actions[0].outputs[1].published),
        paperExpressionDoi: relevantStep.inputs[0].doi,
        evaluationLocator: buildEvaluationLocatorFromHypothesisUrl(relevantStep.actions[0].outputs[1].content[0].url),
        authors: [],
        evaluationType: 'curation-statement',
      },
    ],
    skipped: [],
  })),
);
