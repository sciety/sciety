import axios from 'axios';
import { Maybe } from 'true-myth';

type PrereviewRow = {
  id: string,
  n_prereviews: number,
};

type PrereviewResponse = {
  results: ReadonlyArray<PrereviewRow>,
};

const biorxivPrefix = /^10\.1101\//;

const formatRow = (row: PrereviewRow): Maybe<string> => {
  const articleDoi = row.id.replace(/^doi\//, '');
  if (!articleDoi.match(biorxivPrefix)) {
    return Maybe.nothing();
  }

  return Maybe.just(`${new Date().toISOString()},${articleDoi},doi:10.5281/zenodo.3678326`);
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  // -d '{"query":{"string":null,"sortBy":"reviews","page":1}}'
  const { data } = await axios.post<PrereviewResponse>(
    'https://www.prereview.org/data/preprints/search',
    { headers: { Accept: 'application/json' } },
  );
  data.results.forEach((row) => {
    if (row.n_prereviews > 0) {
      formatRow(row).map((formatted) => process.stdout.write(`${formatted}\n`));
    }
  });
})();
