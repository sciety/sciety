import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { ReadModel, handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { selectAllListsContainingExpression } from '../../../src/read-models/lists/select-all-lists-containing-expression';
import { ArticleId } from '../../../src/types/article-id';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const selectAllListsContainingExpressionHelper = (readModel: ReadModel, expressionDoi: ExpressionDoi) => pipe(
  expressionDoi,
  selectAllListsContainingExpression(readModel),
  RA.map((list) => list.id),
);

describe('select-all-lists-containing-expression', () => {
  describe('when the article is not in any list', () => {
    const readModel = initialState();

    const listIds = selectAllListsContainingExpressionHelper(readModel, arbitraryExpressionDoi());

    it('returns an empty result', () => {
      expect(listIds).toStrictEqual([]);
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
    const listIds = selectAllListsContainingExpressionHelper(readModel, expressionDoi);

    it('returns one list', () => {
      expect(listIds).toHaveLength(1);
      expect(listIds[0]).toStrictEqual(listCreatedEvent.listId);
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
    const listIds = selectAllListsContainingExpressionHelper(readModel, expressionDoi);

    it('returns two lists', () => {
      expect(listIds).toHaveLength(2);
      expect(listIds).toContain(userListCreatedEvent.listId);
      expect(listIds).toContain(groupListCreatedEvent.listId);
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
    const listIds = selectAllListsContainingExpressionHelper(readModel, expressionDoi);

    it('returns an empty result', () => {
      expect(listIds).toStrictEqual([]);
    });
  });
});
