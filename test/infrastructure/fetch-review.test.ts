import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchDataciteReview } from '../../src/infrastructure/fetch-datacite-review';
import { FetchHypothesisAnnotation } from '../../src/infrastructure/fetch-hypothesis-annotation';
import { FetchNcrcReview } from '../../src/infrastructure/fetch-ncrc-review';
import { fetchReview } from '../../src/infrastructure/fetch-review';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryHypothesisAnnotationId } from '../types/hypothesis-annotation-id.helper';
import { arbitraryNcrcId } from '../types/ncrc-id.helper';

const reviewDoi = arbitraryDoi();

const fetchedReview = {
  fullText: pipe('Very good', toHtmlFragment),
  url: new URL('https://example.com'),
};

describe('fetch-review', () => {
  it('returns a Datacite review when given a DOI', async () => {
    const fetchDataciteReview: FetchDataciteReview = () => TE.right(fetchedReview);
    const fetcher = fetchReview(fetchDataciteReview, shouldNotBeCalled, shouldNotBeCalled);
    const review = await fetcher(reviewDoi)();

    expect(review).toStrictEqual(E.right(fetchedReview));
  });

  it('returns a Hypothes.is annotation when given a Hypothes.is id', async () => {
    const fetchHypothesisAnnotation: FetchHypothesisAnnotation = () => TE.right(fetchedReview);
    const fetcher = fetchReview(shouldNotBeCalled, fetchHypothesisAnnotation, shouldNotBeCalled);
    const review = await fetcher(arbitraryHypothesisAnnotationId())();

    expect(review).toStrictEqual(E.right(fetchedReview));
  });

  it('returns an Ncrc review when given a NcrcId', async () => {
    const fetchNcrcReview: FetchNcrcReview = () => TE.right(fetchedReview);
    const fetcher = fetchReview(shouldNotBeCalled, shouldNotBeCalled, fetchNcrcReview);
    const review = await fetcher(arbitraryNcrcId())();

    expect(review).toStrictEqual(E.right(fetchedReview));
  });
});
