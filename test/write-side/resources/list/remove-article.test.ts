import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../../src/domain-events/index.js';
import { removeArticle } from '../../../../src/write-side/resources/list/remove-article.js';
import { arbitraryString } from '../../../helpers.js';
import { arbitraryArticleId } from '../../../types/article-id.helper.js';
import { arbitraryListId } from '../../../types/list-id.helper.js';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper.js';

describe('remove-article', () => {
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
