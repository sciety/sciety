import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { toUserId } from '../../src/types/user-id';
import { renderPage } from '../../src/user-page/render-page';

describe('render-page', () => {
  describe('when the user display name is found', () => {
    it('is used as the page title', async () => {
      const renderer = renderPage(
        () => TE.right(toHtmlFragment('')),
        () => TE.right(toHtmlFragment('')),
        () => TE.right('someone'),
        () => TE.right(toHtmlFragment('')),
      );

      const result = await renderer(toUserId('1234'), O.none)();

      expect(result).toStrictEqual(E.right(expect.objectContaining({ title: 'someone' })));
    });
  });

  describe('when the user display name is not found', () => {
    it('returns a not-found error page', async () => {
      const renderer = renderPage(
        () => TE.right(toHtmlFragment('')),
        () => TE.right(toHtmlFragment('')),
        () => TE.left('not-found'),
        () => TE.right(toHtmlFragment('')),
      );
      const result = await renderer(toUserId('1234'), O.none)();

      expect(result).toStrictEqual(E.left(expect.objectContaining({ type: 'not-found' })));
    });
  });

  describe('when the user display name is unavailable', () => {
    it('returns an unavailable error page', async () => {
      const renderer = renderPage(
        () => TE.right(toHtmlFragment('')),
        () => TE.right(toHtmlFragment('')),
        () => TE.left('unavailable'),
        () => TE.right(toHtmlFragment('')),
      );
      const result = await renderer(toUserId('1234'), O.none)();

      expect(result).toStrictEqual(E.left(expect.objectContaining({ type: 'unavailable' })));
    });
  });
});
