import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, EventOfType } from '../../../src/domain-events';
import { getAllUserLists } from '../../../src/read-models/lists/get-all-user-lists';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { ArticleId } from '../../../src/types/article-id';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-all-user-lists', () => {
  describe('when there are user lists, both populated and not populated', () => {
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
      ],
      RA.reduce(initialState(), handleEvent),
    );

    const listIds = pipe(
      getAllUserLists(readModel)(),
      RA.map((list) => list.id),
    );

    it('returns all user lists, including unpopulated ones', () => {
      expect(listIds).toContain(userList1CreatedEvent.listId);
      expect(listIds).toContain(userList2CreatedEvent.listId);
    });
  });

  describe('when there are only group lists', () => {
    const groupListCreatedEvent: EventOfType<'ListCreated'> = {
      ...arbitraryListCreatedEvent(),
      ownerId: LOID.fromGroupId(arbitraryGroupId()),
    };
    const readModel = pipe(
      [groupListCreatedEvent],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(getAllUserLists(readModel)()).toStrictEqual([]);
    });
  });

  describe('when there are no lists', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(getAllUserLists(readModel)()).toStrictEqual([]);
    });
  });

  describe('when there are both user and group lists', () => {
    const userListCreatedEvent: EventOfType<'ListCreated'> = {
      ...arbitraryListCreatedEvent(),
      ownerId: LOID.fromUserId(arbitraryUserId()),
    };
    const groupListCreatedEvent: EventOfType<'ListCreated'> = {
      ...arbitraryListCreatedEvent(),
      ownerId: LOID.fromGroupId(arbitraryGroupId()),
    };
    const readModel = pipe(
      [userListCreatedEvent, groupListCreatedEvent],
      RA.reduce(initialState(), handleEvent),
    );

    const result = getAllUserLists(readModel)();

    it('returns only user lists', () => {
      expect(result).toHaveLength(1);
      expect(result[0].id).toStrictEqual(userListCreatedEvent.listId);
    });
  });
});
