import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { ReadModel, handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { selectListContainingExpression } from '../../../src/read-models/lists/select-list-containing-expression';
import { ArticleId } from '../../../src/types/article-id';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import * as LOID from '../../../src/types/list-owner-id';
import { UserId } from '../../../src/types/user-id';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const selectListContainingExpressionHelper = (
  readModel: ReadModel,
  userId: UserId,
  expressionDoi: ExpressionDoi,
) => pipe(
  expressionDoi,
  selectListContainingExpression(readModel)(userId),
  O.getOrElseW(shouldNotBeCalled),
  (list) => list.id,
);

describe('select-list-containing-article', () => {
  const expressionDoi = arbitraryExpressionDoi();
  const articleId = new ArticleId(expressionDoi);
  const listId = arbitraryListId();
  const userId = arbitraryUserId();

  describe('when the user has added an article to the list', () => {
    const readModel = pipe(
      [
        constructEvent('ListCreated')({
          listId,
          name: arbitraryString(),
          description: arbitraryString(),
          ownerId: LOID.fromUserId(userId),
        }),
        constructEvent('ArticleAddedToList')({ articleId, listId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    const selectedListId = selectListContainingExpressionHelper(readModel, userId, expressionDoi);

    it('the query returns the first list id', () => {
      expect(selectedListId).toStrictEqual(listId);
    });
  });

  describe('when the user has added and removed an article', () => {
    const readModel = pipe(
      [
        constructEvent('ListCreated')({
          listId,
          name: arbitraryString(),
          description: arbitraryString(),
          ownerId: LOID.fromUserId(userId),
        }),
        constructEvent('ArticleAddedToList')({ articleId, listId }),
        constructEvent('ArticleRemovedFromList')({ articleId, listId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('the query returns nothing', () => {
      expect(selectListContainingExpression(readModel)(userId)(expressionDoi)).toStrictEqual(O.none);
    });
  });

  describe('when two users have added articles', () => {
    const userId2 = arbitraryUserId();
    const listId2 = arbitraryListId();
    const readModel = pipe(
      [
        constructEvent('ListCreated')({
          listId,
          name: arbitraryString(),
          description: arbitraryString(),
          ownerId: LOID.fromUserId(userId),
        }),
        constructEvent('ArticleAddedToList')({ articleId, listId }),
        constructEvent('ListCreated')({
          listId: listId2,
          name: arbitraryString(),
          description: arbitraryString(),
          ownerId: LOID.fromUserId(userId2),
        }),
        constructEvent('ArticleAddedToList')({ articleId, listId: listId2 }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const selectedListIdForFirstUser = selectListContainingExpressionHelper(readModel, userId, expressionDoi);
    const selectedListIdForSecondUser = selectListContainingExpressionHelper(readModel, userId2, expressionDoi);

    it('the query returns the first list id belonging to the first user', () => {
      expect(selectedListIdForFirstUser).toStrictEqual(listId);
    });

    it('the query returns the first list id belonging to the second user', () => {
      expect(selectedListIdForSecondUser).toStrictEqual(listId2);
    });
  });
});
