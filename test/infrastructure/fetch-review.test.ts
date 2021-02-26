import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchDataciteReview } from '../../src/infrastructure/fetch-datacite-review';
import { FetchHypothesisAnnotation } from '../../src/infrastructure/fetch-hypothesis-annotation';
import { FetchNcrcReview } from '../../src/infrastructure/fetch-ncrc-review';
import { fetchReview } from '../../src/infrastructure/fetch-review';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { HypothesisAnnotationId } from '../../src/types/hypothesis-annotation-id';
import * as NcrcId from '../../src/types/ncrc-id';
import { shouldNotBeCalled } from '../should-not-be-called';

const reviewDoi = new Doi('10.5281/zenodo.3678325');

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
    const fetchHypothesisAnnotation: FetchHypothesisAnnotation = () => TE.right({
      fullText: pipe('Very good', toHtmlFragment, O.some),
      url: new URL('https://example.com'),
    });
    const fetcher = fetchReview(shouldNotBeCalled, fetchHypothesisAnnotation, shouldNotBeCalled);
    const review = await fetcher(new HypothesisAnnotationId('fhAtGNVDEemkyCM-sRPpVQ'))();

    expect(review).toStrictEqual(E.right(fetchedReview));
  });

  it('returns an Ncrc review when given a NcrcId', async () => {
    const fetchNcrcReview: FetchNcrcReview = () => TE.right(fetchedReview);
    const fetcher = fetchReview(shouldNotBeCalled, shouldNotBeCalled, fetchNcrcReview);
    const review = await fetcher(NcrcId.fromString('foo'))();

    expect(review).toStrictEqual(E.right(fetchedReview));
  });
});
