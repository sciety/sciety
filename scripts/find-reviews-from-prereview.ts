import axios from 'axios';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';

void pipe(
  TE.tryCatch(
    async () => axios.get<Json>(
      'https://www.prereview.org/api/v2/preprints?limit=10',
      { headers: { Accept: 'application/json' } },
    ),
    String,
  ),
  TE.bimap(
    (error) => process.stderr.write(error),
    ({ data }) => process.stdout.write(JSON.stringify(data, undefined, 2)),
  ),
  TE.fold(
    () => process.exit(1),
    () => process.exit(0),
  ),
)();
