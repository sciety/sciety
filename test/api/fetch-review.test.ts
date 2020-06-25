import { FetchDataciteReview } from '../../src/api/fetch-datacite-review';
import createFetchReview from '../../src/api/fetch-review';
import Doi from '../../src/data/doi';
import HypothesisAnnotationId from '../../src/data/hypothesis-annotation-id';
import shouldNotBeCalled from '../should-not-be-called';

const reviewDoi = new Doi('10.5281/zenodo.3678325');

describe('fetch-review', (): void => {
  it('returns a Datacite review when given a DOI', async () => {
    const dataciteReview = {
      publicationDate: new Date(),
      summary: 'Very good',
      url: new URL(`https://doi.org/${reviewDoi.value}`),
    };
    const fetchDataciteReview: FetchDataciteReview = async () => dataciteReview;
    const fetchReview = createFetchReview(fetchDataciteReview);
    const review = await fetchReview(reviewDoi);

    expect(review).toStrictEqual(dataciteReview);
  });

  it('returns a Hypothes.is annotation when given a Hypothes.is id', async () => {
    const fetchReview = createFetchReview(shouldNotBeCalled);
    const review = await fetchReview(new HypothesisAnnotationId('fhAtGNVDEemkyCM-sRPpVQ'));

    expect(review.summary).toContain('eLife');
  });
});
