import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ArticleId } from '../../../../src/types/article-id';
import { removeArticle } from '../../../../src/write-side/resources/list/remove-article';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryListId } from '../../../types/list-id.helper';

describe('remove-article', () => {
  const listId = arbitraryListId();
  const expressionDoi = arbitraryExpressionDoi();

  describe('given a command', () => {
    const result = pipe(
      [],
      removeArticle({
        listId,
        articleId: expressionDoi,
      }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises exactly one event', () => {
      expect(result).toHaveLength(1);
    });

    it('returns an ArticleRemovedFromList event', () => {
      expect(result[0]).toBeDomainEvent('ArticleRemovedFromList', {
        articleId: new ArticleId(expressionDoi),
        listId,
      });
    });
  });
});
