import { namedNode } from '@rdfjs/data-model';
import rdfFetch, { DatasetResponse } from '@rdfjs/fetch-lite';
import datasetFactory from 'rdf-dataset-indexed';
import { DatasetCore } from 'rdf-js';
import createFetchDataset, { FetchDatasetError } from '../../src/api/fetch-dataset';
import article3 from '../../src/data/article3';

const createStubFetch = (response: Partial<DatasetResponse<DatasetCore>>): typeof rdfFetch => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (): Promise<any> => response
);

describe('fetch-dataset', (): void => {
  describe('dataset found', (): void => {
    it('fetches a dataset for an IRI', async () => {
      const iri = namedNode(`https://doi.org/${article3.reviews[0].doi}`);
      const cannedDataset = datasetFactory([]);
      const stubFetch = createStubFetch({
        ok: true,
        dataset: async (): Promise<DatasetCore> => cannedDataset,
      });

      const fetchDataset = createFetchDataset(stubFetch);
      const dataset = await fetchDataset(iri);

      expect(dataset.dataset).toBe(cannedDataset);
      expect(dataset.term).toBe(iri);
    });
  });

  describe('dataset not found', (): void => {
    it('throws an errors', async (): Promise<void> => {
      const iri = namedNode('https://doi.org/not-a-doi');
      const stubFetch = createStubFetch({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        url: iri.value,
      });

      const fetchDataset = createFetchDataset(stubFetch);

      await expect(fetchDataset(iri)).rejects.toStrictEqual(new FetchDatasetError(`Received a 404 Not Found for ${iri.value}`));
    });
  });
});
