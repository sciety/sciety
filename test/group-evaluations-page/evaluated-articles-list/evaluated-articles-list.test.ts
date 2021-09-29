import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { evaluatedArticlesList } from '../../../src/group-evaluations-page/evaluated-articles-list';
import * as DE from '../../../src/types/data-error';
import { arbitraryDate, arbitraryNumber } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroup } from '../../types/group.helper';

describe('evaluated-articles-list', () => {
  describe('when some of the article details can\'t be retrieved', () => {
    it.todo('returns the successful article cards');
  });

  describe('when none of the article details can be retrieved', () => {
    it('returns "this information can\'t be found" message', async () => {
      const result = await pipe(
        evaluatedArticlesList({
          fetchArticle: () => TE.left(DE.unavailable),
          findVersionsForArticleDoi: shouldNotBeCalled,
        })(
          [{
            doi: arbitraryDoi(),
            evaluationCount: arbitraryNumber(1, 5),
            latestActivityDate: arbitraryDate(),
          }],
          arbitraryGroup(),
          1,
          1,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result).toContain('This information can not be found');
    });
  });

  describe('when the requested page is out of bounds', () => {
    it('returns not found', async () => {
      const pageNumber = 2;
      const pageSize = 1;
      const result = await evaluatedArticlesList({
        fetchArticle: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
      })(
        [{
          doi: arbitraryDoi(),
          evaluationCount: arbitraryNumber(1, 5),
          latestActivityDate: arbitraryDate(),
        }],
        arbitraryGroup(),
        pageNumber,
        pageSize,
      )();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
