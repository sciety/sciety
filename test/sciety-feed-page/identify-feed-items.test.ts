import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { articleAddedToList } from '../../src/domain-events';
import { identifyFeedItems } from '../../src/sciety-feed-page/identify-feed-items';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('identify-feed-items', () => {
  const listId = arbitraryListId();
  const earlierDate = new Date('2022-10-18');
  const laterDate = new Date('2022-10-19');

  const events = [
    articleAddedToList(arbitraryArticleId(), listId, earlierDate),
    articleAddedToList(arbitraryArticleId(), listId, laterDate),
  ];

  it.failing('uses the date of the latest event when collapsing', () => {
    const firstFeedItem = pipe(
      events,
      identifyFeedItems(20, 1),
      E.match(
        shouldNotBeCalled,
        identity,
      ),
    ).items[0];

    expect(firstFeedItem.date).toStrictEqual(laterDate);
  });
});
