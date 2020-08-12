import axios from 'axios';
import { JsonCompatible } from '../src/types/json';

const publisherGroupId = 'NEGQVabn';

type HypothesisResponse = JsonCompatible<{
  rows: Array<{
    created: string,
    uri: string,
  }>
}>;

void (async (): Promise<void> => {
  const { data } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}`);
  process.stdout.write('Date,Article DOI\n');

  data.rows.forEach((row) => {
    const doiRegex = '(10\\.[0-9]{4,}(?:\\.[1-9][0-9]*)*/(?:[^%"#?\\s])+)';
    const matches = new RegExp(`https://www.biorxiv.org/content/${doiRegex}v[0-9]+$`).exec(row.uri);
    if (matches === null) {
      throw new Error(`Cannot parse a DOI out of '${row.uri}'`);
    }
    const doi = matches[1];
    process.stdout.write(`${row.created},${doi}\n`);
  });
})();
