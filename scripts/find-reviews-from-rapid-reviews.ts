import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { constant, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';

const rapidReviewCodec = t.type({
  message: t.type({
    items: t.array(t.type({
      URL: t.string,
      created: t.type({
        'date-time': tt.DateFromISOString,
      }),
      relation: t.type({
        'is-review-of': t.array(t.type({
          id: t.string,
        })),
      }),
    })),
  }),
});

const extractEvaluations = (data: t.TypeOf<typeof rapidReviewCodec>) => pipe(
  data.message.items.map((item) => ({
    date: item.created['date-time'].toISOString(),
    articleDoi: item.relation['is-review-of'][0].id,
    evaluationLocator: `rapidreviews:${item.URL}`,
  })),
  RA.filter(({ articleDoi }) => articleDoi.startsWith('10.1101/')),
);

void (async (): Promise<void> => {
  pipe(
    await axios.get<JSON>('https://api.crossref.org/prefixes/10.1162/works?filter=type:peer-review', {
      headers: {
        'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
      },
    }),
    (response) => response.data,
    rapidReviewCodec.decode,
    E.map(extractEvaluations),
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
