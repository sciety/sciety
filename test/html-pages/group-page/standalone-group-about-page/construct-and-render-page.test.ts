import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../../src/types/data-error';
import { arbitraryWord } from '../../../helpers';
import { TestFramework, createTestFramework } from '../../../framework';
import { constructAndRenderPage } from '../../../../src/html-pages/group-page/standalone-group-about-page';

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
        },
        constructAndRenderPage({
          ...framework.queries,
          ...framework.happyPathThirdParties,
        }),
        TE.mapLeft((error) => error.type),
      )();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
