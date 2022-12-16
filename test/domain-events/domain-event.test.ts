/* eslint-disable jest/expect-expect */
import { expectTypeOf } from 'expect-type';
import { EventByName } from '../../src/domain-events';
import { constructEvent } from '../../src/domain-events/domain-event';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('domain-event', () => {
  describe('construct', () => {
    it('can construct ArticleAddedToList events', () => {
      const articleId = arbitraryArticleId();
      const listId = arbitraryListId();

      const event = constructEvent('ArticleAddedToList')({ articleId, listId });

      expectTypeOf(event).toMatchTypeOf<EventByName<'ArticleAddedToList'>>();
    });
  });
});
