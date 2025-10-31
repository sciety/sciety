import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from '../../discover-published-evaluations';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const transformCoarNotificationUriToAnnouncementActionUri = (
  dependencies: Dependencies,
) => (uri: string): TE.TaskEither<string, string> => pipe(
  uri,
  dependencies.fetchData<string>,
  TE.mapLeft(() => 'unavailable'),
);
