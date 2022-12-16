/* eslint-disable jest/expect-expect */
import { expectTypeOf } from 'expect-type';
import { EventByName } from '../../src/domain-events';
import { constructEvent } from '../../src/domain-events/domain-event';
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
});
