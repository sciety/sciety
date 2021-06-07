import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchRapidReview } from '../../src/infrastructure/fetch-rapid-review';
import { toHtmlFragment } from '../../src/types/html-fragment';
import * as RapidReviewDoi from '../../src/types/rapid-review-doi';
import { arbitraryUri } from '../helpers';

describe('fetch-rapid-review', () => {
  it('returns the evaluation', async () => {
    const reviewId = RapidReviewDoi.fromValidatedString('10.1162/2e3983f5.602c0e93');
    const evaluation = await fetchRapidReview(reviewId)();
    const expected = {
      fullText: pipe('The authors make a convincing argument for re-envisioning US public health, employment and anti-discrimination laws around social solidarity, and a compelling case for further scholarship that considers the public health implications of employment law.', toHtmlFragment),
      url: new URL('https://doi.org/10.1162/2e3983f5.9328aef6'),
    };

    expect(evaluation).toStrictEqual(E.right(expected));
  });

  it.skip('given an arbitrary URL the result contains the same URL', async () => {
    const doiUrl = arbitraryUri();
    const evaluationUrl = await pipe(
      fetchRapidReview(doiUrl),
      TE.map((evaluation) => evaluation.url.toString()),
    )();

    expect(evaluationUrl).toStrictEqual(E.right(doiUrl));
  });

  it.todo('returns the summary as the fullText');

  describe('cant find fullText', () => {
    it.todo('return unavailable');
  });
});
