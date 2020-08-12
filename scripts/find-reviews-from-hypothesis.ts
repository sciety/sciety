import axios from 'axios';
import { JsonCompatible } from '../src/types/json';

const publisherGroupId = process.argv[2];

type HypothesisResponse = JsonCompatible<{
  total: number,
  rows: Array<{
    created: string,
    uri: string,
  }>
}>;

void (async (): Promise<void> => {
  const perPage = 200;
  const { data: firstPage } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=biorxiv&limit=${perPage}`);
  process.stdout.write('Date,Article DOI\n');

  firstPage.rows.forEach((row) => {
    const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
    const matches = new RegExp(`https://www.biorxiv.org/content/${doiRegex}v[0-9]+$`).exec(row.uri);
    if (matches === null) {
      throw new Error(`Cannot parse a DOI out of '${row.uri}'`);
    }
    const doi = matches[1];
    process.stdout.write(`${row.created},${doi}\n`);
  });

  const numRequestsNeeded = Math.ceil(firstPage.total / perPage);

  for (let i = 1; i < numRequestsNeeded; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const { data } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}&uri.parts=biorxiv&limit=${perPage}&offset=${perPage * i}`);
    data.rows.forEach((row) => {
      const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
      const matches = new RegExp(`https://www.biorxiv.org/content/${doiRegex}v[0-9]+$`).exec(row.uri);
      if (matches === null) {
        throw new Error(`Cannot parse a DOI out of '${row.uri}'`);
      }
      const doi = matches[1];
      process.stdout.write(`${row.created},${doi}\n`);
    });
  }
})();
