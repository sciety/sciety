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
    describe('and the article is in the list', () => {
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

      it('causes a state change in which the article is removed from the list', () => {
        expect(result).toHaveLength(1);
        expect(result[0]).toBeDomainEvent('ArticleRemovedFromList', {
          articleId: new ArticleId(expressionDoi),
          listId,
        });
      });
    });

    describe('and the article was never in the list', () => {
      it.todo('rejects the command with "article-not-found"');
    });

    describe('and the article was in the list but has been removed', () => {
      it.todo('accepts the command and causes no state change');
    });
  });

  describe('when the list never existed', () => {
    it.todo('rejects the command with "list-not-found"');
  });

  describe('when the list existed and was later deleted', () => {
    it.todo('rejects the command with "list-not-found"');
  });
});
