import * as E from 'fp-ts/Either';
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
    it.todo('returns "this information can\'t be found" message');
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
