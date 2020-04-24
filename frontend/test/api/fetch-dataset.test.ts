import { namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import createFetchDataset from '../../src/api/fetch-dataset';
import article3 from '../../src/data/article3';

describe('fetch-review', (): void => {
  describe('dataset found', (): void => {
    it('fetches a dataset for an IRI', async () => {
      const iri = namedNode(`https://doi.org/${article3.reviews[0].doi}`);

      const fetchDataset = createFetchDataset();
      const dataset = await fetchDataset(iri);

      expect(dataset.match(iri, schema.name).size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('dataset not found', (): void => {
    it('throws an errors', () => {
      const iri = namedNode('https://doi.org/not-a-doi');

      const fetchDataset = createFetchDataset();

      expect(fetchDataset(iri)).rejects.toStrictEqual(new Error(`Received a 404 Not Found for ${iri.value}`));
    });
  });
});
