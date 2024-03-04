import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { constructEvent } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { selectAllListsContainingExpression } from '../../../src/read-models/lists/select-all-lists-containing-expression';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { ArticleId } from '../../../src/types/article-id';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';

describe('select-all-lists-containing-expression', () => {
  describe('when the article is not in any list', () => {
    const readModel = initialState();

    it('returns an empty result', () => {
      expect(selectAllListsContainingExpression(readModel)(arbitraryExpressionDoi())).toStrictEqual([]);
    });
  });

  describe('when the article appears in one list', () => {
    const listCreatedEvent = arbitraryListCreatedEvent();
    const expressionDoi = arbitraryExpressionDoi();
    const articleId = new ArticleId(expressionDoi);
    const readModel = pipe(
      [
        listCreatedEvent,
        constructEvent('ArticleAddedToList')({ articleId, listId: listCreatedEvent.listId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns one list', () => {
      expect(selectAllListsContainingExpression(readModel)(expressionDoi)).toStrictEqual([
        expect.objectContaining({ id: listCreatedEvent.listId }),
      ]);
    });
  });

  describe('when the article appears in a user and a group list', () => {
    const userListCreatedEvent = {
      ...arbitraryListCreatedEvent(),
      listOwnerId: LOID.fromUserId(arbitraryUserId()),
    };
    const groupListCreatedEvent = {
      ...arbitraryListCreatedEvent(),
      listOwnerId: LOID.fromGroupId(arbitraryGroupId()),
    };
    const expressionDoi = arbitraryExpressionDoi();
    const articleId = new ArticleId(expressionDoi);
    const readModel = pipe(
      [
        userListCreatedEvent,
        constructEvent('ArticleAddedToList')({ articleId, listId: userListCreatedEvent.listId }),
        groupListCreatedEvent,
        constructEvent('ArticleAddedToList')({ articleId, listId: groupListCreatedEvent.listId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns two lists', () => {
      const result = selectAllListsContainingExpression(readModel)(expressionDoi);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(expect.objectContaining({ id: userListCreatedEvent.listId }));
      expect(result).toContainEqual(expect.objectContaining({ id: groupListCreatedEvent.listId }));
    });
  });

  describe('when only other articles appear in lists', () => {
    const listCreatedEvent = arbitraryListCreatedEvent();
    const expressionDoi = arbitraryExpressionDoi();
    const anotherArticleId = arbitraryArticleId();
    const readModel = pipe(
      [
        listCreatedEvent,
        constructEvent('ArticleAddedToList')({ articleId: anotherArticleId, listId: listCreatedEvent.listId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(selectAllListsContainingExpression(readModel)(expressionDoi)).toStrictEqual([]);
    });
  });
});
