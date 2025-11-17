import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

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
  })),
});

const stepsCodec = t.strict({
  steps: t.record(t.string, t.unknown),
});

const docmapResponseCodec = tt.readonlyNonEmptyArray(stepsCodec);

export const retrieveActionDoiFromDocmap = (
  dependencies: Dependencies,
) => (
  docmapUri: string,
): TE.TaskEither<string, unknown> => pipe(
  docmapUri,
  dependencies.fetchData<JSON>,
  TE.flatMapEither(decodeAndReportFailures(docmapResponseCodec)),
  TE.map(RA.findFirst((stepsCodec.is))),
  TE.flatMap(TE.fromOption(() => 'No docmap found.')),
  TE.map((decodedSteps) => decodedSteps.steps),
  TE.map((steps) => Object.values(steps)),
  TE.map(RA.findFirst(stepWithActionDoiCodec.is)),
  TE.flatMap(TE.fromOption(() => 'No Action DOI found.')),
  TE.map((step) => step.actions[0].outputs[0].doi),
);
