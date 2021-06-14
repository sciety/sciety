/**
 * @jest-environment jsdom
 */

import { namedNode } from '@rdfjs/data-model';
import rdfFetch, { DatasetResponse } from '@rdfjs/fetch-lite';
import datasetFactory from 'rdf-dataset-indexed';
import type { DatasetCore } from 'rdf-js';
import { fetchDataset } from '../../src/infrastructure/fetch-dataset';
import { dummyLogger } from '../dummy-logger';
import { arbitraryWord } from '../helpers';

const reviewDoi = arbitraryWord();

const createStubFetch = (response: Partial<DatasetResponse<DatasetCore>>): typeof rdfFetch => (
  async () => response as DatasetResponse<DatasetCore>
);

describe('fetch-dataset', () => {
  describe('dataset found', () => {
    it('fetches a dataset for an IRI', async () => {
      const iri = namedNode(`https://doi.org/${reviewDoi}`);
      const cannedDataset = datasetFactory([]);
      const stubFetch = createStubFetch({
        ok: true,
        dataset: async (): Promise<DatasetCore> => cannedDataset,
      });
      const dataset = await fetchDataset(dummyLogger, stubFetch)(iri);

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
      const dataset = await fetchDataset(dummyLogger, stubFetch)(iri);

      expect(dataset.term).toStrictEqual(usedIri);
    });
  });

  describe('dataset not found', () => {
    it('throws an errors', async () => {
      const iri = namedNode('https://doi.org/not-a-doi');
      const stubFetch = createStubFetch({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        url: iri.value,
      });

      await expect(fetchDataset(dummyLogger, stubFetch)(iri)).rejects.toThrow(`Received a 404 Not Found for ${iri.value}`);
    });
  });
});
