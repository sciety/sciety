import { pipe } from 'fp-ts/function';
import { articleAddedToList, evaluationRecorded, userSavedArticle } from '../../src/domain-events';
import { collapseCloseEvents, collapseCloseListEvents } from '../../src/sciety-feed-page/collapse-close-events';
import { arbitraryDate } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('collapse-close-list-events', () => {
  describe('when there is a uninteresting event', () => {
    const events = [
      userSavedArticle(arbitraryUserId(), arbitraryArticleId(), arbitraryDate()),
    ];
    const result = pipe(
      events,
      collapseCloseListEvents,
    );

    it('returns it unchanged', () => {
      expect(result).toStrictEqual(events);
    });
  });

  describe('when a single article is added to a list', () => {
    const events = [
      articleAddedToList(arbitraryArticleId(), arbitraryListId(), arbitraryDate()),
    ];
    const result = pipe(
      events,
      collapseCloseListEvents,
    );

    it('returns it unchanged', () => {
      expect(result).toStrictEqual(events);
    });
  });

  describe('given consecutive events adding articles to the same list', () => {
    const groupId = arbitraryGroupId();
    const articleId = arbitraryArticleId();
    const laterDate = new Date('2021-09-14 12:00');
    const earlierDate = new Date('2021-09-14 11:00');

    const result = pipe(
      [
        evaluationRecorded(groupId, articleId, arbitraryReviewId(), [], laterDate, arbitraryDate()),
        evaluationRecorded(groupId, articleId, arbitraryReviewId(), [], earlierDate, arbitraryDate()),
      ],
      collapseCloseEvents,
    );

    it('collapses into a single feed item', () => {
      expect(result).toHaveLength(1);
    });

    it('collapses into a Group Evaluated Article feed item', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          type: 'CollapsedGroupEvaluatedArticle',
          groupId,
          articleId,
        },
      )]);
    });

    it('returns the most recent evaluation published date', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          date: laterDate,
        },
      )]);
    });
  });

  describe('given two articles are added to a list separated by an article added to a different list', () => {
    const groupOne = arbitraryGroupId();
    const groupTwo = arbitraryGroupId();

    const events = [
      evaluationRecorded(groupOne, arbitraryArticleId(), arbitraryReviewId()),
      evaluationRecorded(groupTwo, arbitraryArticleId(), arbitraryReviewId()),
      evaluationRecorded(groupOne, arbitraryArticleId(), arbitraryReviewId()),
    ];
    const result = pipe(
      events,
      collapseCloseEvents,
    );

    it('does not collapse the events', () => {
      expect(result).toHaveLength(events.length);
    });
  });
});
