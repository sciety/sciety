import axios from 'axios';

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  type PrereviewResponse = {
    results: [
      {
        id: string,
        n_prereviews: number,
      }
    ]
  };
  // -d '{"query":{"string":null,"sortBy":"reviews","page":1}}'
  const { data } = await axios.post<PrereviewResponse>(
    'https://www.prereview.org/data/preprints/search',
    { headers: { Accept: 'application/json' } },
  );
  data.results.forEach((row) => {
    if (row.n_prereviews > 0) {
      process.stdout.write(`${new Date().toISOString()},${row.id.replace(/^doi\//, '')},doi:10.5281/zenodo.3678326\n`);
    }
  });
})();
