import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchRapidReview } from '../../src/infrastructure/fetch-rapid-review';
import { arbitraryUri } from '../helpers';

const html = `
<!DOCTYPE html>
<html lang="en" data-reactroot="">
<head>
    <meta name="description"
          content="This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings."/>
    <meta property="og:description"
          content="This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings."/>
    <meta name="twitter:description"
          content="This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings."/>
</head>
</html>
`;

describe('fetch-rapid-review', () => {
  it('given an arbitrary URL the result contains the same URL', async () => {
    const doiUrl = arbitraryUri();
    const getHtml = () => TE.right(html);
    const evaluationUrl = await pipe(
      doiUrl,
      fetchRapidReview(getHtml),
      TE.map((evaluation) => evaluation.url.toString()),
    )();

    expect(evaluationUrl).toStrictEqual(E.right(doiUrl));
  });

  it('returns the summary as the fullText', async () => {
    const doiUrl = arbitraryUri();
    const getHtml = () => TE.right(html);
    const fullText = await pipe(
      doiUrl,
      fetchRapidReview(getHtml),
      TE.map((evaluation) => evaluation.fullText),
    )();

    expect(fullText).toStrictEqual(E.right(expect.stringContaining('This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings.')));
  });

  describe('cant find fullText', () => {
    it.todo('return unavailable');
  });
});
