import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const coarNotificationCodec = t.type({
  object: t.type({
    id: t.string,
  }),
});

export const transformCoarNotificationUriToAnnouncementActionUri = (
  dependencies: Dependencies,
) => (uri: string): TE.TaskEither<string, string> => pipe(
  uri,
  dependencies.fetchData<string>,
  TE.map(JSON.parse),
  TE.chainEitherK(decodeAndReportFailures(coarNotificationCodec)),
  TE.map((decodecResponse) => decodecResponse.object.id),
);
