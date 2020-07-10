/**
 * @jest-environment jsdom
 */

import { namedNode } from '@rdfjs/data-model';
import rdfFetch, { DatasetResponse } from '@rdfjs/fetch-lite';
import datasetFactory from 'rdf-dataset-indexed';
import type { DatasetCore } from 'rdf-js';
import createFetchDataset, { FetchDatasetError } from '../../src/infrastructure/fetch-dataset';
import Doi from '../../src/types/doi';
import dummyLogger from '../dummy-logger';

const reviewDoi = new Doi('10.5281/zenodo.3678325');

const createStubFetch = (response: Partial<DatasetResponse<DatasetCore>>): typeof rdfFetch => (
  async () => response as DatasetResponse<DatasetCore>
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

      const fetchDataset = createFetchDataset(dummyLogger, stubFetch);
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

      const fetchDataset = createFetchDataset(dummyLogger, stubFetch);
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

      const fetchDataset = createFetchDataset(dummyLogger, stubFetch);

      await expect(fetchDataset(iri)).rejects.toStrictEqual(new FetchDatasetError(`Received a 404 Not Found for ${iri.value}`));
    });
  });
});
