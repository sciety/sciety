import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

export type ReviewActionFromDocmap = {
  actionOutputDoi: string,
  actionOutputDate: string,
  actionInputDoi: string,
};

const stepWithActionDoiCodec = t.strict({
  actions: t.readonlyArray(t.strict({
    outputs: t.readonlyArray(t.strict({
      published: t.string,
      doi: t.string,
      type: t.union([
        t.literal('editorial-decision'),
        t.literal('review'),
        t.literal('reply'),
      ]),
    })),
    inputs: t.readonlyArray(t.strict({
      doi: t.string,
    })),
  })),
});

const docmapResponseCodec = tt.readonlyNonEmptyArray(t.strict({
  steps: t.record(t.string, t.unknown),
}));

export const retrieveReviewActionsFromDocmap = (
  dependencies: Dependencies,
) => (
  docmapUri: string,
): TE.TaskEither<string, ReadonlyArray<ReviewActionFromDocmap>> => pipe(
  docmapUri,
  dependencies.fetchData<JSON>,
  TE.flatMapEither(decodeAndReportFailures(docmapResponseCodec)),
  TE.map((decodedResponse) => decodedResponse[0].steps),
  TE.map((steps) => Object.values(steps)),
  TE.map(RA.filter(stepWithActionDoiCodec.is)),
  TE.map(RA.chain((steps) => steps.actions)),
  TE.map(RA.map((action) => ({
    actionOutputDoi: action.outputs[0].doi,
    actionOutputDate: action.outputs[0].published,
    actionInputDoi: action.inputs[0].doi,
  }))),
);
