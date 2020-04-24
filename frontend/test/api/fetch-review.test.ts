import datasetFactory from 'rdf-dataset-indexed';
import { quad, literal } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchReview from '../../src/api/fetch-review';
import article3 from '../../src/data/article3';
import shouldNotBeCalled from '../should-not-be-called';

describe('fetch-review', (): void => {
  describe('review found', (): void => {
    it('returns the review', async () => {
      const fetchDataset: FetchDataset = async (iri) => datasetFactory([
        quad(iri, schema.datePublished, literal('2020-02-20')),
        quad(iri, schema.description, literal('A summary')),
      ]);
      const fetchReview = createFetchReview(fetchDataset);
      const review = await fetchReview(article3.reviews[0].doi);
      expect(review.publicationDate).toStrictEqual(new Date('2020-02-20'));
    });
  });

  describe('review not found', (): void => {
    it('throws an error', () => {
      const fetchReview = createFetchReview(shouldNotBeCalled);
      expect(fetchReview('10.1234/5678')).rejects.toStrictEqual(new Error('Review DOI 10.1234/5678 not found'));
    });
  });
});
