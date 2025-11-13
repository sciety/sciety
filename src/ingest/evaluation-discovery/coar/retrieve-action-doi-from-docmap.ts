import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

export const retrieveActionDoiFromDocmap = (
  dependencies: Dependencies,
) => (
  docmapUri: string,
): TE.TaskEither<string, unknown> => pipe(
  docmapUri,
  dependencies.fetchData<JSON>,
  TE.flatMapEither(decodeAndReportFailures(t.readonlyArray(t.unknown))),
);
