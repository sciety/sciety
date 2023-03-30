/* eslint-disable @typescript-eslint/no-unused-vars */
import { DomainEvent, articleAddedToList, userFollowedEditorialCommunity } from '../../src/domain-events';
import { createInMemoryEventstore } from '../../src/eventstore/create-in-memory-eventstore';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('in memory eventstore', () => {
  describe('a new eventstore', () => {
    const voidListener = () => undefined;
    const eventstore = createInMemoryEventstore(voidListener);

    it('contains no events', async () => {
      const allEvents = await eventstore.getAllEvents();

      expect(allEvents).toStrictEqual([]);
    });
  });

  describe('given an eventstore containing some events', () => {
    const mockListener = jest.fn((es: ReadonlyArray<DomainEvent>) => undefined);
    const eventstore = createInMemoryEventstore(mockListener);

    beforeEach(async () => {
      await eventstore.commitEvents([
        articleAddedToList(arbitraryArticleId(), arbitraryListId()),
      ])();
    });

    describe('when an event is committed', () => {
      const event = userFollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId());

      beforeEach(async () => {
        await eventstore.commitEvents([event])();
      });

      it('is dispatched to the listeners', async () => {
        expect(mockListener).toHaveBeenCalledWith([event]);
      });

      it('is the last event listed by getAllEvents', async () => {
        const allEvents = await eventstore.getAllEvents();
        const lastEventListed = allEvents[allEvents.length - 1];

        expect(lastEventListed).toStrictEqual(event);
      });
    });
  });
});
