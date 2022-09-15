import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { articleActivityPage } from '../src/article-page';
import { SanitisedHtmlFragment } from '../src/types/sanitised-html-fragment';
import { arbitrarySanitisedHtmlFragment } from '../test/helpers';
import { arbitraryDoi } from '../test/types/doi.helper';

describe('correct-language-semantics', () => {
  describe('in the article page', () => {
    const irrelevantPorts = {
      fetchReview: () => TE.left(undefined),
      findVersionsForArticleDoi: () => TO.none,
      getAllEvents: T.of([]),
    };

    describe('the article title', () => {
      const createGetArticleDetails = (title: string) => () => (TE.right({
        doi: arbitraryDoi(),
        title: title as SanitisedHtmlFragment,
        abstract: arbitrarySanitisedHtmlFragment(),
        server: 'biorxiv' as const,
        authors: O.none,
      }));

      describe('when detected as Portuguese', () => {
        it('is marked up as Portuguese', async () => {
          const ports = {
            fetchArticle: createGetArticleDetails('Título arbitrário em português'),
            ...irrelevantPorts,
          };
          const renderPage = articleActivityPage(ports);
          const rendered = await renderPage({
            doi: arbitraryDoi(),
            user: O.none,
          })();

          expect(rendered).toStrictEqual(E.right(expect.objectContaining({
            content: expect.stringContaining('<h1><span lang="pt">Título arbitrário em português</span></h1>'),
          })));
        });
      });

      describe('when detected as Spanish', () => {
        it('is marked up as Spanish', async () => {
          const ports = {
            fetchArticle: createGetArticleDetails('Título arbitrário em português'),
            ...irrelevantPorts,
          };
          const renderPage = articleActivityPage(ports);
          const rendered = await renderPage({
            doi: arbitraryDoi(),
            user: O.none,
          })();

          expect(rendered).toStrictEqual(E.right(expect.objectContaining({
            content: expect.stringContaining('<h1><span lang="pt">Título arbitrário em português</span></h1>'),
          })));
        });
      });

      describe('when detected as English', () => {
        it('is marked up as English', async () => {
          const ports = {
            fetchArticle: createGetArticleDetails('Título arbitrario en español'),
            ...irrelevantPorts,
          };
          const renderPage = articleActivityPage(ports);
          const rendered = await renderPage({
            doi: arbitraryDoi(),
            user: O.none,
          })();

          expect(rendered).toStrictEqual(E.right(expect.objectContaining({
            content: expect.stringContaining('<h1><span lang="es">Título arbitrario en español</span></h1>'),
          })));
        });
      });
    });

    describe('the article abstract', () => {
      const createGetArticleDetails = (abstract: string) => () => (TE.right({
        doi: arbitraryDoi(),
        title: arbitrarySanitisedHtmlFragment(),
        abstract: abstract as SanitisedHtmlFragment,
        server: 'biorxiv' as const,
        authors: O.none,
      }));

      describe('when detected as Portuguese', () => {
        it.todo('is marked up as Portuguese');
      });

      describe('when detected as Spanish', () => {
        it.todo('is marked up as Spanish');
      });

      describe('when detected as English', () => {
        it.skip('is marked up as English', async () => {
          const articleAbstract = `
            This text represents the abstract of this article in English.
          `;
          const ports = {
            fetchArticle: createGetArticleDetails(articleAbstract),
            ...irrelevantPorts,
          };
          const renderPage = articleActivityPage(ports);
          const rendered = await renderPage({
            doi: arbitraryDoi(),
            user: O.none,
          })();

          expect(rendered).toStrictEqual(E.right(expect.objectContaining({
            content: expect.stringContaining(`<h1><span lang="en">${articleAbstract}</span></h1>`),
          })));
        });
      });
    });
  });

  describe.skip('in the article card', () => {
    it.todo('to be done later');
  });
});
