import axios from 'axios';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';

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

const processRow = (server: string) => (row: Row): void => {
  // const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
  const shortRegex = '((?:[^%"#?\\s])+)';
  // TODO bioRxiv/medRxiv content is available at multiple URL patterns:
  // curl "https://api.hypothes.is/api/search?uri.parts=biorxiv&limit=100" | jq --raw-output ".rows[].target[].source"
  const matches = new RegExp(`https?://(?:www.)?${server}.org/cgi/content/(?:10.1101|short)/${shortRegex}$`).exec(row.uri);
  if (matches === null) {
    process.stderr.write(`Cannot parse a DOI out of '${row.uri}'\n`);
  } else {
    const doi = matches[1];
    process.stdout.write(`${row.created},10.1101/${doi},hypothesis:${row.id}\n`);
  }
};

const processServer = (server: string) => async (): Promise<void> => {
  const perPage = 200;
  const { data: firstPage } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?user=${userId}&uri.parts=${server}&limit=${perPage}&sort=created&order=asc`);

  firstPage.rows.forEach(processRow(server));
  let latestDate = encodeURIComponent(firstPage.rows[firstPage.rows.length - 1].created);

  const numRequestsNeeded = Math.ceil(firstPage.total / perPage);

  // eslint-disable-next-line no-loops/no-loops
  for (let i = 1; i < numRequestsNeeded; i += 1) {
    const { data } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?user=${userId}&uri.parts=${server}&limit=${perPage}&sort=created&order=asc&search_after=${latestDate}`);
    data.rows.forEach(processRow(server));
    latestDate = encodeURIComponent(data.rows[data.rows.length - 1].created);
  }
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');
  await pipe(
    ['biorxiv', 'medrxiv'],
    T.traverseArray(processServer),
  )();
})();
