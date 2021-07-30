import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Evaluation } from './evaluations';
import { SkippedItem } from './update-all';

const publisherGroupId = process.argv[2];

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

const processRow = (server: string) => (row: Row): E.Either<SkippedItem, Evaluation> => {
  const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
  // eslint-disable-next-line no-useless-escape
  const matches = new RegExp(`https://www.${server}.org/content/${doiRegex}v[0-9]+\.*$`).exec(row.uri);
  if (matches === null) {
    return E.left({ item: row.uri, reason: 'Cannot parse into a biorxiv DOI' });
  }
  const doi = matches[1];
  return E.right({
    date: new Date(row.created),
    articleDoi: doi,
    evaluationLocator: `hypothesis:${row.id}`,
  });
};

const processServer = async (server: string): Promise<void> => {
  const perPage = 200;
  let data;
  let pageNumber = 0;
  // eslint-disable-next-line no-loops/no-loops
  do {
    data = (await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=${server}&limit=${perPage}&offset=${perPage * pageNumber}`)).data;
    pipe(
      data.rows,
      RA.map(processRow(server)),
      RA.rights,
      RA.map((evaluation) => {
        process.stdout.write(`${evaluation.date.toISOString()},${evaluation.articleDoi},${evaluation.evaluationLocator}\n`);
        return evaluation;
      }),
    );
    data.rows.forEach(processRow(server));
    pageNumber += 1;
  } while (data.rows.length > 0);
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');
  await Promise.all([
    processServer('biorxiv'),
    processServer('medrxiv'),
  ]);
})();
