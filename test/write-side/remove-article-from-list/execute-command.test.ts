import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../src/domain-events';
import { removeArticle } from '../../../src/write-side/resources/list/remove-article';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

describe('execute-command', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('the article is in the list', () => {
    const result = pipe(
      [
        constructEvent('ListCreated')({
          listId, name: arbitraryString(), description: arbitraryString(), ownerId: arbitraryListOwnerId(),
        }),
        constructEvent('ArticleAddedToList')({ articleId, listId }),
      ],
      removeArticle({
        listId,
        articleId,
      }),
    );

    it('succeeds and raises an event', () => {
      expect(result).toStrictEqual(E.right([expect.objectContaining({
        type: 'ArticleRemovedFromList',
        articleId,
        listId,
      })]));
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
        articleId,
      }),
    );

    it('succeeds and raises no events', () => {
      expect(result).toStrictEqual(E.right([]));
    });
  });
});
