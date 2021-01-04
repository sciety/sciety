import axios from 'axios';
import { JsonCompatible } from '../src/types/json';

const publisherGroupId = process.argv[2];

type HypothesisResponse = JsonCompatible<{
  total: number,
  rows: Array<{
    id: string,
    created: string,
    uri: string,
  }>
}>;

void (async (): Promise<void> => {
  const perPage = 200;
  const { data: firstPage } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=biorxiv&limit=${perPage}`);
  process.stdout.write('Date,Article DOI,Review ID\n');

  firstPage.rows.forEach((row) => {
    const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
    const matches = new RegExp(`https://www.biorxiv.org/content/${doiRegex}v[0-9]+$`).exec(row.uri);
    if (matches === null) {
      throw new Error(`Cannot parse a DOI out of '${row.uri}'`);
    }
    const doi = matches[1];
    // TODO: remove this when biorxiv have posted this to crossref #357
    if (doi === '10.1101/2020.12.16.423020') {
      process.stderr.write('Skipping 10.1101/2020.12.16.423020\n');
      return;
    }
    process.stdout.write(`${row.created},${doi},hypothesis:${row.id}\n`);
  });

  const numRequestsNeeded = Math.ceil(firstPage.total / perPage);

  for (let i = 1; i < numRequestsNeeded; i += 1) {
    const { data } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=biorxiv&limit=${perPage}&offset=${perPage * i}`);
    data.rows.forEach((row) => {
      const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
      const matches = new RegExp(`https://www.biorxiv.org/content/${doiRegex}v[0-9]+$`).exec(row.uri);
      if (matches === null) {
        throw new Error(`Cannot parse a DOI out of '${row.uri}'`);
      }
      const doi = matches[1];
      // TODO: remove this when biorxiv have posted this to crossref #357
      if (doi === '10.1101/2020.12.16.423020') {
        process.stderr.write('Skipping 10.1101/2020.12.16.423020\n');
        return;
      }
      process.stdout.write(`${row.created},${doi},hypothesis:${row.id}\n`);
    });
  }
})();
