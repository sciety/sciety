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

    expect(fullText).toStrictEqual(E.right(expect.stringContaining('This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings.')));
  });

  describe('cant find fullText', () => {
    it.todo('return unavailable');
  });
});
