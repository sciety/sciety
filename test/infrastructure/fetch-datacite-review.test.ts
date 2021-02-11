import { literal } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import * as E from 'fp-ts/Either';
import datasetFactory from 'rdf-dataset-indexed';
import { createFetchDataciteReview } from '../../src/infrastructure/fetch-datacite-review';
import { FetchDataset, FetchDatasetError } from '../../src/infrastructure/fetch-dataset';
import { Doi } from '../../src/types/doi';
import { dummyLogger } from '../dummy-logger';

const reviewDoi = new Doi('10.5281/zenodo.3678325');

describe('fetch-datacite-review', () => {
  describe('when the response contains Datacite data', () => {
    it('returns the review', async () => {
      const fetchDataset: FetchDataset = async (iri) => (
        clownface({ dataset: datasetFactory(), term: iri })
          .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
          .addOut(schema.description, 'The full text')
      );
      const fetchReview = createFetchDataciteReview(fetchDataset, dummyLogger);
      const review = await fetchReview(reviewDoi)();

      expect(review).toMatchObject(E.right({
        fullText: 'The full text',
      }));
    });
  });

  describe('when the review has no description', () => {
    it('returns unavailable', async () => {
      const fetchDataset: FetchDataset = async (iri) => (
        clownface({ dataset: datasetFactory(), term: iri })
      );
      const fetchReview = createFetchDataciteReview(fetchDataset, dummyLogger);
      const review = await fetchReview(reviewDoi)();

      expect(review).toStrictEqual(E.left('unavailable'));
    });
  });

  describe('when Datacite is unreachable', () => {
    it('returns unavailable', async () => {
      const fetchDataset: FetchDataset = async () => {
        throw new FetchDatasetError('Something went wrong.');
      };
      const fetchReview = createFetchDataciteReview(fetchDataset, dummyLogger);
      const review = await fetchReview(reviewDoi)();

      expect(review).toStrictEqual(E.left('unavailable'));
    });
  });
});
