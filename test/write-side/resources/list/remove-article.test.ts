import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events';
import { ArticleId } from '../../../../src/types/article-id';
import { removeArticle } from '../../../../src/write-side/resources/list/remove-article';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';

describe('remove-article', () => {
  const listId = arbitraryListId();
  const expressionDoi = arbitraryExpressionDoi();

  describe('the article is in the list', () => {
    const result = pipe(
      [
        constructEvent('ListCreated')({
          listId, name: arbitraryString(), description: arbitraryString(), ownerId: arbitraryListOwnerId(),
        }),
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
      ],
      removeArticle({
        listId,
        articleId: expressionDoi,
      }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises exactly one event', () => {
      expect(result).toHaveLength(1);
    });

    it('succeeds and raises an event', () => {
      expect(result[0]).toBeDomainEvent('ArticleRemovedFromList', {
        articleId: new ArticleId(expressionDoi),
        listId,
      });
    });
  });

  describe('the article is not in the list', () => {
    const result = pipe(
      [
        constructEvent('ListCreated')({
          listId, name: arbitraryString(), description: arbitraryString(), ownerId: arbitraryListOwnerId(),
        }),
      ],
      removeArticle({
        listId,
        articleId: expressionDoi,
      }),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('succeeds and raises no events', () => {
      expect(result).toHaveLength(0);
    });
  });
});
