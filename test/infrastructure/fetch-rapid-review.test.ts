import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchRapidReview } from '../../src/infrastructure/fetch-rapid-review';
import { HtmlFragment } from '../../src/types/html-fragment';
import { dummyLogger } from '../dummy-logger';
import { arbitraryString, arbitraryUri } from '../helpers';

const rapidReviewResponseWith = (metaTags: ReadonlyArray<[string, string]>) => `
  <!DOCTYPE html>
  <html lang="en" data-reactroot="">
  <head>
      ${metaTags.map(([name, value]) => `<meta name="${name}" content="${value}">`).join('\n')}
  </head>
  </html>
`;

const toFullText = (html: string): TE.TaskEither<'not-found' | 'unavailable', HtmlFragment> => {
  const doiUrl = arbitraryUri();
  const getHtml = () => TE.right(html);
  return pipe(
    doiUrl,
    fetchRapidReview(dummyLogger, getHtml),
    TE.map((evaluation) => evaluation.fullText),
  );
};

describe('fetch-rapid-review', () => {
  it('given an arbitrary URL the result contains the same URL', async () => {
    const doiUrl = arbitraryUri();
    const getHtml = () => pipe(
      rapidReviewResponseWith([
        ['dc.creator', arbitraryString()],
      ]),
      TE.right,
    );
    const evaluationUrl = await pipe(
      doiUrl,
      fetchRapidReview(dummyLogger, getHtml),
      TE.map((evaluation) => evaluation.url.toString()),
    )();

    expect(evaluationUrl).toStrictEqual(E.right(doiUrl));
  });

  describe('when fetching review', () => {
    describe('with one author', () => {
      it('returns the description as part of the fullText', async () => {
        const description = arbitraryString();

        expect(await pipe(
          rapidReviewResponseWith([
            ['dc.creator', arbitraryString()],
            ['description', description],
          ]),
          toFullText,
        )()).toStrictEqual(E.right(expect.stringContaining(description)));
      });

      it('returns the creator as part of the fullText', async () => {
        const creator = arbitraryString();

        expect(await pipe(
          rapidReviewResponseWith([
            ['dc.creator', creator],
          ]),
          toFullText,
        )()).toStrictEqual(E.right(expect.stringContaining(`<h3>${creator}</h3>`)));
      });

      it('returns the title as part of the fullText', async () => {
        const title = arbitraryString();

        expect(await pipe(
          rapidReviewResponseWith([
            ['dc.title', `${title}&quot;Hello&quot;`],
            ['dc.creator', arbitraryString()],
          ]),
          toFullText,
        )()).toStrictEqual(E.right(expect.stringContaining(`${title}"Hello"`)));
      });
    });

    describe('with more than one author', () => {
      it.skip('returns a review', async () => {
        const title = arbitraryString();

        expect(await pipe(
          rapidReviewResponseWith([
            ['dc.title', `Review 1: ${title}`],
            ['dc.creator', arbitraryString()],
            ['dc.creator', arbitraryString()],
            ['description', arbitraryString()],
          ]),
          toFullText,
        )()).toStrictEqual(E.right(expect.stringContaining(`Review 1: ${title}`)));
      });
    });
  });

  describe('when fetching summary', () => {
    it('returns the description as part of the fullText', async () => {
      const description = arbitraryString();

      expect(await pipe(
        rapidReviewResponseWith([
          ['dc.creator', arbitraryString()],
          ['dc.creator', arbitraryString()],
          ['description', description],
        ]),
        toFullText,
      )()).toStrictEqual(E.right(expect.stringContaining(description)));
    });

    describe('cant find the description meta tag', () => {
      it('returns "not-found"', async () => {
        expect(await pipe(
          rapidReviewResponseWith([
            ['dc.creator', arbitraryString()],
            ['dc.creator', arbitraryString()],
          ]),
          toFullText,
        )()).toStrictEqual(E.left('not-found'));
      });
    });
  });

  describe('when we dont know what kind of evaluation it is', () => {
    it('returns "unavailable"', async () => {
      expect(await pipe(
        rapidReviewResponseWith([
          ['dc.title', arbitraryString()],
        ]),
        toFullText,
      )()).toStrictEqual(E.left('unavailable'));
    });
  });

  describe('getHtml fails', () => {
    it('return "unavailable"', async () => {
      const guid = new URL(arbitraryUri());
      const getHtml = () => TE.left('unavailable' as const);
      const fullText = await fetchRapidReview(dummyLogger, getHtml)(guid.toString())();

      expect(fullText).toStrictEqual(E.left('unavailable' as const));
    });
  });
});
