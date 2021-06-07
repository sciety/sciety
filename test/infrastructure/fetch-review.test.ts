import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchReview } from '../../src/infrastructure/fetch-review';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { arbitraryString } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryHypothesisAnnotationId } from '../types/hypothesis-annotation-id.helper';
import { arbitraryNcrcId } from '../types/ncrc-id.helper';

const reviewDoi = arbitraryDoi();

const fetchedEvaluation = {
  fullText: pipe(arbitraryString(), toHtmlFragment),
  url: new URL('https://example.com'),
};

describe('fetch-review', () => {
  it('returns a Datacite review when given a DOI', async () => {
    const fetchDataciteReview = () => TE.right(fetchedEvaluation);
    const fetcher = fetchReview(
      fetchDataciteReview,
      shouldNotBeCalled,
      shouldNotBeCalled,
      shouldNotBeCalled,
      shouldNotBeCalled,
    );
    const review = await fetcher(reviewDoi)();

    expect(review).toStrictEqual(E.right(fetchedEvaluation));
  });

  it('returns a Hypothes.is annotation when given a Hypothes.is id', async () => {
    const fetchHypothesisAnnotation = () => TE.right(fetchedEvaluation);
    const fetcher = fetchReview(
      shouldNotBeCalled,
      fetchHypothesisAnnotation,
      shouldNotBeCalled,
      shouldNotBeCalled,
      shouldNotBeCalled,
    );
    const review = await fetcher(arbitraryHypothesisAnnotationId())();

    expect(review).toStrictEqual(E.right(fetchedEvaluation));
  });

  it('returns an Ncrc review when given a NcrcId', async () => {
    const fetchNcrcReview = () => TE.right(fetchedEvaluation);
    const fetcher = fetchReview(
      shouldNotBeCalled,
      shouldNotBeCalled,
      fetchNcrcReview,
      shouldNotBeCalled,
      shouldNotBeCalled,
    );
    const review = await fetcher(arbitraryNcrcId())();

    expect(review).toStrictEqual(E.right(fetchedEvaluation));
  });

  it.todo('returns an Prelights highlight when given a PrelightsId');
});
