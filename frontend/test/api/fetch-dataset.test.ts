import { namedNode } from '@rdfjs/data-model';
import rdfFetch from '@rdfjs/fetch-lite';
import datasetFactory from 'rdf-dataset-indexed';
import { DatasetCore } from 'rdf-js';
import createFetchDataset, { FetchDatasetError } from '../../src/api/fetch-dataset';
import article3 from '../../src/data/article3';

describe('fetch-dataset', (): void => {
  describe('dataset found', (): void => {
    it('fetches a dataset for an IRI', async () => {
      const iri = namedNode(`https://doi.org/${article3.reviews[0].doi}`);
      const cannedDataset = datasetFactory([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stubFetch: typeof rdfFetch = async (): Promise<any> => ({
        ok: true,
        dataset: async (): Promise<DatasetCore> => cannedDataset,
      });

      const fetchDataset = createFetchDataset(stubFetch);
      const dataset = await fetchDataset(iri);

      expect(dataset).toBe(cannedDataset);
    });
  });

  describe('dataset not found', (): void => {
    it('throws an errors', async (): Promise<void> => {
      const iri = namedNode('https://doi.org/not-a-doi');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stubFetch: typeof rdfFetch = async (): Promise<any> => ({
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
