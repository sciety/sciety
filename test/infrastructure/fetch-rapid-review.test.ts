import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { fetchRapidReview } from '../../src/infrastructure/fetch-rapid-review';
import { Review } from '../../src/infrastructure/review';
import { toHtmlFragment } from '../../src/types/html-fragment';
import * as RapidReviewDoi from '../../src/types/rapid-review-doi';

describe('fetch-rapid-review', () => {
  it('returns the review', async () => {
    const reviewId = RapidReviewDoi.fromValidatedString('10.1162/2e3983f5.602c0e93');
    const review = await fetchRapidReview(reviewId)();
    const expected: Review = {
      fullText: pipe('The authors make a convincing argument for re-envisioning US public health, employment and anti-discrimination laws around social solidarity, and a compelling case for further scholarship that considers the public health implications of employment law.', toHtmlFragment),
      url: new URL('https://doi.org/10.1162/2e3983f5.9328aef6'),
    };

    expect(review).toStrictEqual(E.right(expected));
  });
});
