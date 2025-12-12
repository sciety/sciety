import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const coarNotificationCodec = (originId?: string) => t.strict({
  ...(originId ? {
    origin: t.strict({
      id: t.literal(originId),
    }),
  } : {}),
  object: t.strict({
    id: t.string,
  }),
});

export const transformCoarNotificationUriToAnnouncementActionUri = (
  dependencies: Dependencies,
  originId?: string,
) => (uri: string): TE.TaskEither<string, string> => pipe(
  uri,
  dependencies.fetchData<JSON>,
  TE.flatMapEither(decodeAndReportFailures(coarNotificationCodec(originId))),
  TE.map((decodedResponse) => decodedResponse.object.id),
);
