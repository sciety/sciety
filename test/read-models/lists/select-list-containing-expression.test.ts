import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events/index.js';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event.js';
import * as LOID from '../../../src/types/list-owner-id.js';
import { arbitraryString } from '../../helpers.js';
import { arbitraryListId } from '../../types/list-id.helper.js';
import { arbitraryUserId } from '../../types/user-id.helper.js';
import { selectListContainingExpression } from '../../../src/read-models/lists/select-list-containing-expression.js';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper.js';
import { ArticleId } from '../../../src/types/article-id.js';

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

    it('the query returns the first list id', () => {
      expect(selectListContainingExpression(readModel)(userId)(expressionDoi)).toStrictEqual(
        O.some(expect.objectContaining({ id: listId })),
      );
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

    it('the query returns the first list id belonging to the first user', () => {
      expect(selectListContainingExpression(readModel)(userId)(expressionDoi)).toStrictEqual(
        O.some(expect.objectContaining({ id: listId })),
      );
    });

    it('the query returns the first list id belonging to the second user', () => {
      expect(selectListContainingExpression(readModel)(userId2)(expressionDoi)).toStrictEqual(
        O.some(expect.objectContaining({ id: listId2 })),
      );
    });
  });
});
