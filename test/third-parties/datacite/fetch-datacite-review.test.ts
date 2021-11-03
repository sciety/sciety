import { literal } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { flow, identity, pipe } from 'fp-ts/function';
import datasetFactory from 'rdf-dataset-indexed';
import { FetchDataset } from '../../../src/infrastructure/fetch-dataset';
import { fetchDataciteReview } from '../../../src/third-parties/datacite';
import * as DE from '../../../src/types/data-error';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';

const reviewDoi = arbitraryWord();

describe('fetch-datacite-review', () => {
  describe('when the response contains Datacite data', () => {
    it('returns the review', async () => {
      const fetchDataset: FetchDataset = async (iri) => (
        clownface({ dataset: datasetFactory(), term: iri })
          .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
          .addOut(schema.description, 'The full text')
      );
      const fetchReview = fetchDataciteReview(fetchDataset, dummyLogger);
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
      const fetchReview = fetchDataciteReview(fetchDataset, dummyLogger);
      const review = await pipe(
        reviewDoi,
        fetchReview,
        T.map(flow(
          E.matchW(
            identity,
            shouldNotBeCalled,
          ),
          DE.isUnavailable,
        )),
      )();

      expect(review).toBe(true);
    });
  });

  describe('when Datacite is unreachable', () => {
    it('returns unavailable', async () => {
      const fetchDataset: FetchDataset = async () => {
        throw new Error('Something went wrong.');
      };
      const fetchReview = fetchDataciteReview(fetchDataset, dummyLogger);
      const review = await pipe(
        reviewDoi,
        fetchReview,
        T.map(flow(
          E.matchW(
            identity,
            shouldNotBeCalled,
          ),
          DE.isUnavailable,
        )),
      )();

      expect(review).toBe(true);
    });
  });
});
