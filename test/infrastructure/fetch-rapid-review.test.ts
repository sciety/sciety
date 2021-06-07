import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchRapidReview } from '../../src/infrastructure/fetch-rapid-review';
import { arbitraryUri } from '../helpers';

describe('fetch-rapid-review', () => {
  it('given an arbitrary URL the result contains the same URL', async () => {
    const doiUrl = arbitraryUri();
    const evaluationUrl = await pipe(
      fetchRapidReview(doiUrl),
      TE.map((evaluation) => evaluation.url.toString()),
    )();

    expect(evaluationUrl).toStrictEqual(E.right(doiUrl));
  });

  it('returns the summary as the fullText', async () => {
    const doiUrl = arbitraryUri();
    const fullText = await pipe(
      fetchRapidReview(doiUrl),
      TE.map((evaluation) => evaluation.fullText),
    )();

    expect(fullText).toStrictEqual(E.right(expect.stringContaining('The authors make a convincing argument for re-envisioning US public health, employment and anti-discrimination laws around social solidarity, and a compelling case for further scholarship that considers the public health implications of employment law.')));
  });

  describe('cant find fullText', () => {
    it.todo('return unavailable');
  });
});
