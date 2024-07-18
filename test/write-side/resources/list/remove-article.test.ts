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

  describe('when the list exists', () => {
    const listCreatedEvent = constructEvent('ListCreated')({
      listId, name: arbitraryString(), description: arbitraryString(), ownerId: arbitraryListOwnerId(),
    });

    describe('and the article is in the list', () => {
      const result = pipe(
        [
          listCreatedEvent,
          constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
        ],
        removeArticle({
          listId,
          articleId: expressionDoi,
        }),
        E.getOrElseW(shouldNotBeCalled),
      );

      it('causes a state change in which the article is removed from the list', () => {
        expect(result).toHaveLength(1);
        expect(result[0]).toBeDomainEvent('ArticleRemovedFromList', {
          articleId: new ArticleId(expressionDoi),
          listId,
        });
      });
    });

    describe('and the article was never in the list', () => {
      const result = pipe(
        [
          listCreatedEvent,
        ],
        removeArticle({
          listId,
          articleId: arbitraryExpressionDoi(),
        }),
      );

      it.failing('rejects the command with "article-not-found"', () => {
        expect(result).toStrictEqual(E.left('article-not-found'));
      });
    });

    describe('and the article was in the list but has been removed', () => {
      const result = pipe(
        [
          listCreatedEvent,
          constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
          constructEvent('ArticleRemovedFromList')({ articleId: new ArticleId(expressionDoi), listId }),
        ],
        removeArticle({
          listId,
          articleId: expressionDoi,
        }),
      );

      it('accepts the command and causes no state change', () => {
        expect(result).toStrictEqual(E.right([]));
      });
    });
  });

  describe('when the list never existed', () => {
    const result = pipe(
      [],
      removeArticle({
        listId: arbitraryListId(),
        articleId: arbitraryExpressionDoi(),
      }),
    );

    it.failing('rejects the command with "list-not-found"', () => {
      expect(result).toStrictEqual(E.left('list-not-found'));
    });
  });

  describe('when the list existed and was later deleted', () => {
    const result = pipe(
      [
        constructEvent('ListCreated')({
          listId,
          name: arbitraryString(),
          description: arbitraryString(),
          ownerId: arbitraryListOwnerId(),
        }),
        constructEvent('ListDeleted')({
          listId,
        }),
      ],
      removeArticle({
        listId,
        articleId: arbitraryExpressionDoi(),
      }),
    );

    it.failing('rejects the command with "list-not-found"', () => {
      expect(result).toStrictEqual(E.left('list-not-found'));
    });
  });
});
