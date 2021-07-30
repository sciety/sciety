import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {SkippedItem} from './update-all';
import {Evaluation} from './evaluations';

const userId = process.argv[2];

type Row = {
  id: string,
  created: string,
  uri: string,
};

type HypothesisResponse = {
  total: number,
  rows: Array<Row>,
};

// TODO bioRxiv/medRxiv content is available at multiple URL patterns:
// curl "https://api.hypothes.is/api/search?uri.parts=biorxiv&limit=100" | jq --raw-output ".rows[].target[].source"

const toEvaluation = (server: string) => (row: Row): E.Either<SkippedItem, Evaluation> => {
  const shortRegex = '((?:[^%"#?\\s])+)';
  const matches = new RegExp(`https?://(?:www.)?${server}.org/cgi/content/(?:10.1101|short)/${shortRegex}$`).exec(row.uri);
  if (matches === null) {
    return E.left({ item: row.uri, reason: 'Cannot parse into the biorxiv DOI' });
  }
  const doi = matches[1];
  return E.right({
    date: new Date(row.created),
    articleDoi: `10.1101/${doi}`,
    evaluationLocator: `hypothesis:${row.id}`,
  });
};

const processServer = (server: string) => async (): Promise<void> => {
  const perPage = 200;
  let latestDate = encodeURIComponent(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString());
  let { data } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?user=${userId}&uri.parts=${server}&limit=${perPage}&sort=created&order=asc&search_after=${latestDate}`);

  // eslint-disable-next-line no-loops/no-loops
  while (data.rows.length > 0) {
    pipe(
      data.rows,
      RA.map(toEvaluation(server)),
      RA.rights,
      RA.map((evaluation) => {
        process.stdout.write(`${evaluation.date.toISOString()},${evaluation.articleDoi},${evaluation.evaluationLocator}\n`);
        return evaluation;
      }),
    );
    latestDate = encodeURIComponent(data.rows[data.rows.length - 1].created);
    data = (await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?user=${userId}&uri.parts=${server}&limit=${perPage}&sort=created&order=asc&search_after=${latestDate}`)).data;
  }
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');
  await pipe(
    ['biorxiv', 'medrxiv'],
    T.traverseArray(processServer),
  )();
})();
