import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { arbitraryList } from './list-helper';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { constructEvent } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { selectAllListsContainingExpression } from '../../../src/read-models/lists/select-all-lists-containing-expression';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { ArticleId } from '../../../src/types/article-id';

describe('select-all-lists-containing-expression', () => {
  describe('when the article is not in any list', () => {
    const readModel = initialState();

    it('returns an empty result', () => {
      expect(selectAllListsContainingExpression(readModel)(arbitraryExpressionDoi())).toStrictEqual([]);
    });
  });

  describe('when the article appears in one list', () => {
    const list = arbitraryList();
    const expressionDoi = arbitraryExpressionDoi();
    const articleId = new ArticleId(expressionDoi);
    const readModel = pipe(
      [
        constructEvent('ListCreated')({
          listId: list.id,
          name: list.name,
          description: list.description,
          ownerId: list.ownerId,
        }),
        constructEvent('ArticleAddedToList')({ articleId, listId: list.id }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns one list', () => {
      expect(selectAllListsContainingExpression(readModel)(expressionDoi)).toStrictEqual([
        expect.objectContaining({ id: list.id }),
      ]);
    });
  });

  describe('when the article appears in a user and a group list', () => {
    const userList = arbitraryList(LOID.fromUserId(arbitraryUserId()));
    const groupList = arbitraryList(LOID.fromGroupId(arbitraryGroupId()));
    const expressionDoi = arbitraryExpressionDoi();
    const articleId = new ArticleId(expressionDoi);
    const readModel = pipe(
      [
        constructEvent('ListCreated')({
          listId: userList.id,
          name: userList.name,
          description: userList.description,
          ownerId: userList.ownerId,
        }),
        constructEvent('ArticleAddedToList')({ articleId, listId: userList.id }),
        constructEvent('ListCreated')({
          listId: groupList.id,
          name: groupList.name,
          description: groupList.description,
          ownerId: groupList.ownerId,
        }),
        constructEvent('ArticleAddedToList')({ articleId, listId: groupList.id }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns two lists', () => {
      const result = selectAllListsContainingExpression(readModel)(expressionDoi);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(expect.objectContaining({ id: userList.id }));
      expect(result).toContainEqual(expect.objectContaining({ id: groupList.id }));
    });
  });

  describe('when only other articles appear in lists', () => {
    const list = arbitraryList();
    const expressionDoi = arbitraryExpressionDoi();
    const anotherArticleId = arbitraryArticleId();
    const readModel = pipe(
      [
        constructEvent('ListCreated')({
          listId: list.id,
          name: list.name,
          description: list.description,
          ownerId: list.ownerId,
        }),
        constructEvent('ArticleAddedToList')({ articleId: anotherArticleId, listId: list.id }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(selectAllListsContainingExpression(readModel)(expressionDoi)).toStrictEqual([]);
    });
  });
});
