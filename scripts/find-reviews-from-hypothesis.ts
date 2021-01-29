import axios from 'axios';
import { JsonCompatible } from '../src/types/json';

const publisherGroupId = process.argv[2];

type Row = {
  id: string,
  created: string,
  uri: string,
};

type HypothesisResponse = JsonCompatible<{
  total: number,
  rows: Array<Row>,
}>;

const processRow = (server: string) => (row: Row): void => {
  const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
  const matches = new RegExp(`https://www.${server}.org/content/${doiRegex}v[0-9]+$`).exec(row.uri);
  if (matches === null) {
    throw new Error(`Cannot parse a DOI out of '${row.uri}'`);
  }
  const doi = matches[1];
  process.stdout.write(`${row.created},${doi},hypothesis:${row.id}\n`);
};

const processServer = async (server: string): Promise<void> => {
  const perPage = 200;
  const { data: firstPage } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=${server}&limit=${perPage}`);

  firstPage.rows.forEach(processRow(server));

  const numRequestsNeeded = Math.ceil(firstPage.total / perPage);

  for (let i = 1; i < numRequestsNeeded; i += 1) {
    const { data } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=${server}&limit=${perPage}&offset=${perPage * i}`);
    data.rows.forEach(processRow(server));
  }
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');
  await processServer('biorxiv');
})();
