import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { EventOfType, constructEvent } from '../../../src/domain-events';
import { getNonEmptyUserLists } from '../../../src/read-models/lists/get-non-empty-user-lists';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { ArticleId } from '../../../src/types/article-id';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-non-empty-user-lists', () => {
  describe('when there are populated user lists', () => {
    const userList1CreatedEvent: EventOfType<'ListCreated'> = {
      ...arbitraryListCreatedEvent(),
      ownerId: LOID.fromUserId(arbitraryUserId()),
    };
    const userList2CreatedEvent: EventOfType<'ListCreated'> = {
      ...arbitraryListCreatedEvent(),
      ownerId: LOID.fromUserId(arbitraryUserId()),
    };
    const readModel = pipe(
      [
        userList1CreatedEvent,
        userList2CreatedEvent,
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: userList1CreatedEvent.listId }),
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: userList2CreatedEvent.listId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    const listIds = pipe(
      getNonEmptyUserLists(readModel)(),
      RA.map((list) => list.id),
    );

    it('returns only the populated user lists', () => {
      expect(listIds[0]).toStrictEqual(userList1CreatedEvent.listId);
      expect(listIds[1]).toStrictEqual(userList2CreatedEvent.listId);
    });
  });

  describe('when the only user lists are empty', () => {
    const userList1CreatedEvent: EventOfType<'ListCreated'> = {
      ...arbitraryListCreatedEvent(),
      ownerId: LOID.fromUserId(arbitraryUserId()),
    };
    const userList2CreatedEvent: EventOfType<'ListCreated'> = {
      ...arbitraryListCreatedEvent(),
      ownerId: LOID.fromUserId(arbitraryUserId()),
    };
    const readModel = pipe(
      [
        userList1CreatedEvent,
        userList2CreatedEvent,
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(getNonEmptyUserLists(readModel)()).toStrictEqual([]);
    });
  });

  describe('when there are only group lists', () => {
    const groupListCreatedEvent: EventOfType<'ListCreated'> = {
      ...arbitraryListCreatedEvent(),
      ownerId: LOID.fromGroupId(arbitraryGroupId()),
    };
    const readModel = pipe(
      [
        groupListCreatedEvent,
        constructEvent('ArticleAddedToList')({ articleId: new ArticleId(arbitraryExpressionDoi()), listId: groupListCreatedEvent.listId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(getNonEmptyUserLists(readModel)()).toStrictEqual([]);
    });
  });

  describe('when there are no lists', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(getNonEmptyUserLists(readModel)()).toStrictEqual([]);
    });
  });
});
