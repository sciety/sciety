/**
 * @jest-environment jsdom
 */

import { namedNode } from '@rdfjs/data-model';
import rdfFetch, { DatasetResponse } from '@rdfjs/fetch-lite';
import datasetFactory from 'rdf-dataset-indexed';
import { DatasetCore } from 'rdf-js'; // eslint-disable-line import/no-extraneous-dependencies -- https://github.com/benmosher/eslint-plugin-import/issues/1618
import createFetchDataset, { FetchDatasetError } from '../../src/infrastructure/fetch-dataset';
import Doi from '../../src/types/doi';

const reviewDoi = new Doi('10.5281/zenodo.3678325');

const createStubFetch = (response: Partial<DatasetResponse<DatasetCore>>): typeof rdfFetch => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (): Promise<any> => response
);

describe('fetch-dataset', (): void => {
  describe('dataset found', (): void => {
    it('fetches a dataset for an IRI', async () => {
      const iri = namedNode(`https://doi.org/${reviewDoi}`);
      const cannedDataset = datasetFactory([]);
      const stubFetch = createStubFetch({
        ok: true,
        dataset: async (): Promise<DatasetCore> => cannedDataset,
      });

      const fetchDataset = createFetchDataset(stubFetch);
      const dataset = await fetchDataset(iri);

      expect(dataset.dataset).toBe(cannedDataset);
      expect(dataset.term).toStrictEqual(iri);
    });

    it('fetches a dataset that uses a different IRI', async () => {
      const iri = namedNode(`https://doi.org/${reviewDoi}`);
      const usedIri = namedNode(`http://dx.doi.org/${reviewDoi}`);
      const cannedDataset = datasetFactory([]);
      const stubFetch = createStubFetch({
        ok: true,
        dataset: async (): Promise<DatasetCore> => cannedDataset,
        headers: new Headers({ Link: `<${usedIri.value}>; rel="canonical"` }),
      });

      const fetchDataset = createFetchDataset(stubFetch);
      const dataset = await fetchDataset(iri);

      expect(dataset.term).toStrictEqual(usedIri);
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
