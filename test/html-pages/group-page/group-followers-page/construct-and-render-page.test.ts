import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructAndRenderPage } from '../../../../src/html-pages/group-page/group-followers-page/index.js';
import * as DE from '../../../../src/types/data-error.js';
import { arbitraryWord } from '../../../helpers.js';
import { TestFramework, createTestFramework } from '../../../framework/index.js';

describe('construct-and-render-page', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group does not exist', () => {
    it('returns a notFound error', async () => {
      const result = await pipe(
        {
          slug: arbitraryWord(),
          user: O.none,
          page: 1,
        },
        constructAndRenderPage(framework.queries),
        TE.mapLeft((error) => error.type),
      )();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
