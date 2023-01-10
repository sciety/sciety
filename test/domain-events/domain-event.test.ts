/* eslint-disable jest/expect-expect */
import { expectTypeOf } from 'expect-type';
import { pipe } from 'fp-ts/function';
import { EventByName } from '../../src/domain-events';
import {
  constructEvent, DomainEvent, filterByName, SubsetOfDomainEvent,
} from '../../src/domain-events/domain-event';
import { arbitraryDate } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('domain-event', () => {
  describe('construct', () => {
    const articleId = arbitraryArticleId();
    const listId = arbitraryListId();

    it('can construct ArticleAddedToList events', () => {
      const event = constructEvent('ArticleAddedToList')({ articleId, listId });

      expectTypeOf(event).toMatchTypeOf<EventByName<'ArticleAddedToList'>>();
    });

    it('can construct ArticleAddedToList events with specific date', () => {
      const date = arbitraryDate();

      const event = constructEvent('ArticleAddedToList')({ articleId, listId, date });

      expectTypeOf(event).toMatchTypeOf<EventByName<'ArticleAddedToList'>>();

      expect(event.date).toStrictEqual(date);
    });
  });

  describe('subsetOfDomainEvent', () => {
    it('can narrow DomainEvent to a single type of event', () => {
      type Result = SubsetOfDomainEvent<['UserFollowedEditorialCommunity']>;

      expectTypeOf<Result>().toMatchTypeOf<EventByName<'UserFollowedEditorialCommunity'>>();
    });

    it('can narrow DomainEvent to a smaller union of event types', () => {
      type Result = SubsetOfDomainEvent<['ListCreated', 'ArticleAddedToList']>;

      expectTypeOf<Result>().toMatchTypeOf<EventByName<'ListCreated'> | EventByName<'ArticleAddedToList'>>();
    });
  });

  describe('filterByName', () => {
    it('provides acccess to intersection of event fields in resulting subset of events', () => {
      const filteredEvents = pipe(
        [] as ReadonlyArray<DomainEvent>,
        filterByName(['ArticleAddedToList', 'ListCreated']),
      );

      expectTypeOf(filteredEvents).items.toHaveProperty('listId');
      expectTypeOf(filteredEvents).items.not.toHaveProperty('articleId');
    });
  });
});
