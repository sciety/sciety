import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { constant, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';

const rapidReviewCodec = t.type({});

void (async (): Promise<void> => {
  pipe(
    await axios.get<JSON>('https://api.crossref.org/prefixes/10.1162/works?filter=type:peer-review', {
      headers: {
        'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
      },
    }),
    (response) => response.data,
    rapidReviewCodec.decode,
    E.map(() => [
      {
        date: '2021-01-30T10:06:04Z',
        articleDoi: '10.1101/2020.12.01.405662',
        evaluationLocator: 'rapidreviews:https://doi.org/10.1162/2e3983f5.602c0e93',
      },
      {
        date: '2021-01-30T10:06:04Z',
        articleDoi: '10.1101/2020.12.01.405662',
        evaluationLocator: 'rapidreviews:https://doi.org/10.1162/2e3983f5.85aec587',
      },
      {
        date: '2021-01-30T10:06:04Z',
        articleDoi: '10.1101/2020.12.01.405662',
        evaluationLocator: 'rapidreviews:https://doi.org/10.1162/2e3983f5.e898fa45',
      },
    ]),
    E.bimap(
      (errors) => process.stderr.write(PR.failure(errors).join('\n')),
      (evaluations) => {
        process.stdout.write('Date,Article DOI,Review ID\n');
        pipe(
          evaluations,
          RA.map(({ date, articleDoi, evaluationLocator }) => process.stdout.write(`${date},${articleDoi},${evaluationLocator}\n`)),
        );
      },
    ),
    E.fold(constant(1), constant(0)),
    (exitStatus) => process.exit(exitStatus),
  );
})();
