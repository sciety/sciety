import axios from 'axios';

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

const processRow = (server: string) => (row: Row): void => {
  const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
  // TODO bioRxiv/medRxiv content is available at multiple URL patterns:
  // curl "https://api.hypothes.is/api/search?uri.parts=biorxiv&limit=100" | jq --raw-output ".rows[].target[].source"
  // eslint-disable-next-line no-useless-escape
  const matches = new RegExp(`https://www.${server}.org/content/${doiRegex}v[0-9]+\.*$`).exec(row.uri);
  if (matches === null) {
    throw new Error(`Cannot parse a DOI out of '${row.uri}'`);
  }
  const doi = matches[1];
  process.stdout.write(`${new Date(row.created).toISOString()},${doi},hypothesis:${row.id}\n`);
};

const processServer = async (server: string): Promise<void> => {
  const perPage = 200;
  let data;
  let pageNumber = 0;
  // eslint-disable-next-line no-loops/no-loops
  do {
    data = (await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=${server}&limit=${perPage}&offset=${perPage * pageNumber}`)).data;
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
