import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchRapidReview } from '../../src/infrastructure/fetch-rapid-review';
import { arbitraryUri } from '../helpers';

const html = `
<!DOCTYPE html>
<html lang="en" data-reactroot="">
<head>
    <meta name="dc.title" content="Review 1: &quot;Differential effects of antiseptic mouth rinses on SARS-CoV-2 infectivity in vitro&quot;">
    <meta name="dc.creator" content="Florence Carrouel">
    <meta name="description"
          content="This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings."/>
    <meta property="og:description"
          content="This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings."/>
    <meta name="twitter:description"
          content="This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings."/>
</head>
</html>
`;

const htmlNoDescription = `
<!DOCTYPE html>
<html lang="en" data-reactroot="">
<head>
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

  describe('when fetching review', () => {
    it('returns the description as part of the fullText', async () => {
      const doiUrl = arbitraryUri();
      const getHtml = () => TE.right(html);
      const fullText = await pipe(
        doiUrl,
        fetchRapidReview(getHtml),
        TE.map((evaluation) => evaluation.fullText),
      )();

      expect(fullText).toStrictEqual(E.right(expect.stringContaining('This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings.')));
    });

    it('returns the creator as part of the fullText', async () => {
      const doiUrl = arbitraryUri();
      const getHtml = () => TE.right(html);
      const fullText = await pipe(
        doiUrl,
        fetchRapidReview(getHtml),
        TE.map((evaluation) => evaluation.fullText),
      )();

      expect(fullText).toStrictEqual(E.right(expect.stringContaining('<h3>Florence Carrouel</h3>')));
    });

    it('returns the title as part of the fullText', async () => {
      const doiUrl = arbitraryUri();
      const getHtml = () => TE.right(html);
      const fullText = await pipe(
        doiUrl,
        fetchRapidReview(getHtml),
        TE.map((evaluation) => evaluation.fullText),
      )();

      expect(fullText).toStrictEqual(E.right(expect.stringContaining('Review 1: "Differential effects of antiseptic mouth rinses on SARS-CoV-2 infectivity in vitro"')));
    });

    describe('cant find any relevant meta tags', () => {
      it.skip('return "not-found"', async () => {
        const guid = new URL(arbitraryUri());
        const getHtml = () => TE.right(htmlNoDescription);
        const fullText = await fetchRapidReview(getHtml)(guid.toString())();

        expect(fullText).toStrictEqual(E.left('not-found' as const));
      });
    });
  });

  describe('when fetching summary', () => {
    it.todo('returns the description as part of the fullText');

    describe('cant find the description meta tag', () => {
      it.todo('returns "not-found"');
    });
  });

  describe('when we dont know what kind of evaluation it is', () => {
    it.todo('returns "unavailable"');
  });

  describe('getHtml fails', () => {
    it('return "unavailable"', async () => {
      const guid = new URL(arbitraryUri());
      const getHtml = () => TE.left('unavailable' as const);
      const fullText = await fetchRapidReview(getHtml)(guid.toString())();

      expect(fullText).toStrictEqual(E.left('unavailable' as const));
    });
  });
});
