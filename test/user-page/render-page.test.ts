import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { toHtmlFragment } from '../../src/types/html-fragment';
import toUserId from '../../src/types/user-id';
import createRenderPage from '../../src/user-page/render-page';

describe('render-page', () => {
  describe('when the user display name is found', () => {
    it('is used as the page title', async () => {
      const renderPage = createRenderPage(
        () => TE.right(toHtmlFragment('')),
        () => TE.right(toHtmlFragment('')),
        () => TE.right('someone'),
        () => TE.right(toHtmlFragment('')),
      );

      const result = await renderPage(toUserId('1234'), O.none)();

      expect(result).toStrictEqual(E.right(expect.objectContaining({ title: 'someone' })));
    });
  });

  describe('when the user display name is not found', () => {
    it('returns a not-found error page', async () => {
      const renderPage = createRenderPage(
        () => TE.right(toHtmlFragment('')),
        () => TE.right(toHtmlFragment('')),
        () => TE.left('not-found'),
        () => TE.right(toHtmlFragment('')),
      );
      const result = await renderPage(toUserId('1234'), O.none)();

      expect(result).toStrictEqual(E.left(expect.objectContaining({ type: 'not-found' })));
    });
  });

  describe('when the user display name is unavailable', () => {
    it('returns an unavailable error page', async () => {
      const renderPage = createRenderPage(
        () => TE.right(toHtmlFragment('')),
        () => TE.right(toHtmlFragment('')),
        () => TE.left('unavailable'),
        () => TE.right(toHtmlFragment('')),
      );
      const result = await renderPage(toUserId('1234'), O.none)();

      expect(result).toStrictEqual(E.left(expect.objectContaining({ type: 'unavailable' })));
    });
  });
});
