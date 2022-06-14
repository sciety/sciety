import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { fetchRapidReview } from '../../src/infrastructure/fetch-rapid-review';
import * as DE from '../../src/types/data-error';
import { HtmlFragment } from '../../src/types/html-fragment';
import { dummyLogger } from '../dummy-logger';
import { arbitraryString, arbitraryUri } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

const rapidReviewResponseWith = (metaTags: ReadonlyArray<[string, string]>) => `
  <!DOCTYPE html>
  <html lang="en" data-reactroot="">
  <head>
      ${metaTags.map(([name, value]) => `<meta name="${name}" content="${value}">`).join('\n')}
  </head>
  </html>
`;

const toFullText = (html: string): TE.TaskEither<DE.DataError, HtmlFragment> => {
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
        ['dc.title', `Review ${arbitraryString()}`],
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
      const title = arbitraryString();
      const creator = arbitraryString();
      const description = arbitraryString();

      const fullText = pipe(
        rapidReviewResponseWith([
          ['dc.title', `Review ${title}&quot;Hello&quot;`],
          ['dc.creator', creator],
          ['description', description],
        ]),
        toFullText,
      );

      it('returns the description as part of the fullText', async () => {
        expect(await fullText()).toStrictEqual(E.right(expect.stringContaining(description)));
      });

      it('returns the creator as part of the fullText', async () => {
        expect(await fullText()).toStrictEqual(E.right(expect.stringContaining(`<h3>${creator}</h3>`)));
      });

      it('returns the title as part of the fullText', async () => {
        expect(await fullText()).toStrictEqual(E.right(expect.stringContaining(`${title}"Hello"`)));
      });
    });

    describe('with more than one author', () => {
      const title = arbitraryString();
      const creator = arbitraryString();
      const creatorTwo = arbitraryString();

      const fullText = pipe(
        rapidReviewResponseWith([
          ['dc.title', `Review ${title}`],
          ['dc.creator', creator],
          ['dc.creator', creatorTwo],
        ]),
        toFullText,
      );

      it('returns a review', async () => {
        expect(await fullText()).toStrictEqual(E.right(expect.stringContaining(`Review ${title}`)));
      });

      it('returns the creators as part of the fullText', async () => {
        expect(await fullText()).toStrictEqual(E.right(expect.stringContaining(`<h3>${creator}, ${creatorTwo}</h3>`)));
      });
    });
  });

  describe('when fetching summary', () => {
    const dcTitleOfASummary = () => `Reviews of ${arbitraryString()}`;

    it('returns the description as part of the fullText', async () => {
      const description = arbitraryString();

      expect(await pipe(
        rapidReviewResponseWith([
          ['dc.title', dcTitleOfASummary()],
          ['dc.creator', arbitraryString()],
          ['description', description],
        ]),
        toFullText,
      )()).toStrictEqual(E.right(expect.stringContaining(description)));
    });

    describe('when the description contains bullets', () => {
      it('replaces bullets with line breaks', async () => {
        const ratings = [arbitraryString(), arbitraryString(), arbitraryString()];
        const description = `${ratings[0]} • ${ratings[1]} • ${ratings[2]}`;

        expect(await pipe(
          rapidReviewResponseWith([
            ['dc.title', dcTitleOfASummary()],
            ['dc.creator', arbitraryString()],
            ['description', description],
          ]),
          toFullText,
        )()).toStrictEqual(E.right(expect.stringContaining(
          `${ratings[0]} <br> ${ratings[1]} <br> ${ratings[2]}`,
        )));
      });
    });

    describe('cant find the description meta tag', () => {
      it('returns "not-found"', async () => {
        expect(await pipe(
          rapidReviewResponseWith([
            ['dc.title', dcTitleOfASummary()],
            ['dc.creator', arbitraryString()],
          ]),
          toFullText,
          TE.match(
            identity,
            shouldNotBeCalled,
          ),
        )()).toBe(DE.notFound);
      });
    });
  });

  describe('getHtml fails', () => {
    it('return "unavailable"', async () => {
      const guid = new URL(arbitraryUri());
      const getHtml = () => TE.left(DE.unavailable);
      const fullText = await pipe(
        guid.toString(),
        fetchRapidReview(dummyLogger, getHtml),
        TE.match(
          identity,
          shouldNotBeCalled,
        ),
      )();

      expect(fullText).toBe(DE.unavailable);
    });
  });
});
