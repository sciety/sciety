import { FetchDataciteReview } from '../../src/api/fetch-datacite-review';
import { FetchHypothesisAnnotation } from '../../src/api/fetch-hypothesis-annotation';
import createFetchReview from '../../src/api/fetch-review';
import Doi from '../../src/types/doi';
import HypothesisAnnotationId from '../../src/types/hypothesis-annotation-id';
import shouldNotBeCalled from '../should-not-be-called';

const reviewDoi = new Doi('10.5281/zenodo.3678325');

const fetchedReview = {
  publicationDate: new Date(),
  summary: 'Very good',
  url: new URL('https://example.com'),
};

describe('fetch-review', (): void => {
  it('returns a Datacite review when given a DOI', async () => {
    const fetchDataciteReview: FetchDataciteReview = async () => fetchedReview;
    const fetchReview = createFetchReview(fetchDataciteReview, shouldNotBeCalled);
    const review = await fetchReview(reviewDoi);

    expect(review).toStrictEqual(fetchedReview);
  });

  it('returns a Hypothes.is annotation when given a Hypothes.is id', async () => {
    const fetchHypothesisAnnotation: FetchHypothesisAnnotation = async () => fetchedReview;
    const fetchReview = createFetchReview(shouldNotBeCalled, fetchHypothesisAnnotation);
    const review = await fetchReview(new HypothesisAnnotationId('fhAtGNVDEemkyCM-sRPpVQ'));

    expect(review).toStrictEqual(fetchedReview);
  });
});
