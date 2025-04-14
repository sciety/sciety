/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { decodeAndReportFailures } from './decode-and-report-failures';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';

const url = 'https://kotahi-server-test.fly.dev/api/docmap/group_id/bcdf0f70-1b32-4aa8-9a9e-84265b23a30d/doi/10.1101/2025.03.27.645397';

const contentCodec = t.strict({
  url: t.string,
});

type Content = t.TypeOf<typeof contentCodec>;

const outputCodec = t.strict({
  type: t.string,
  content: t.readonlyArray(contentCodec),
  published: t.string,
});

type Output = t.TypeOf<typeof outputCodec>;

const actionCodec = t.strict({
  outputs: t.readonlyArray(outputCodec),
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

const buildEvaluationLocatorForHypothesis = (contents: ReadonlyArray<Content>) => pipe(
  contents,
  RA.filter((content) => content.url.includes('https://hypothes.is')),
  RA.map((content) => content.url),
  RA.head,
  O.fold(
    () => '',
    (hypothesisUrl) => buildEvaluationLocatorFromHypothesisUrl(hypothesisUrl),
  ),
);

const buildEvaluationType = (inputType: string): string => {
  if (inputType === 'review-article') {
    return 'review';
  }
  if (inputType === 'evaluation-summary') {
    return 'curation-statement';
  }
  return '';
};

const constructPartialEvaluation = (output: Output) => ({
  publishedOn: new Date(output.published),
  evaluationLocator: buildEvaluationLocatorForHypothesis(output.content),
  evaluationType: buildEvaluationType(output.type),
});

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
        ...constructPartialEvaluation(relevantStep.actions[0].outputs[0]),
        paperExpressionDoi: relevantStep.inputs[0].doi,
        authors: [],
      },
      {
        publishedOn: new Date(relevantStep.actions[0].outputs[1].published),
        paperExpressionDoi: relevantStep.inputs[0].doi,
        evaluationLocator: buildEvaluationLocatorForHypothesis(relevantStep.actions[0].outputs[1].content),
        authors: [],
        evaluationType: buildEvaluationType(relevantStep.actions[0].outputs[1].type),
      },
    ],
    skipped: [],
  })),
);
