import { pipe } from 'fp-ts/function';
import { evaluationRecorded, userSavedArticle } from '../../src/domain-events';
import { collapseCloseEvents } from '../../src/sciety-feed-page/collapse-close-events';
import { arbitraryDate } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('collapse-close-events', () => {
  describe('when there is a non-evaluation event', () => {
    const date = new Date('2021-09-14 12:00');
    const result = pipe(
      [
        userSavedArticle(arbitraryUserId(), arbitraryDoi(), date),
      ],
      collapseCloseEvents,
    );

    it('returns the event date', () => {
      expect(result).toStrictEqual([expect.objectContaining({
        date,
      })]);
    });
  });

  describe('when there is a single evaluation on a single article', () => {
    const publishedDate = new Date('2021-09-14 12:00');
    const result = pipe(
      [
        evaluationRecorded(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId(), [], publishedDate, arbitraryDate()),
      ],
      collapseCloseEvents,
    );

    it('returns the evaluation published date', () => {
      expect(result).toStrictEqual([expect.objectContaining({
        date: publishedDate,
      })]);
    });
  });

  describe('given consecutive events in which the same group evaluated an article', () => {
    describe('when there are two evaluations', () => {
      const groupId = arbitraryGroupId();
      const articleId = arbitraryDoi();
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

    describe('when there are three evaluations', () => {
      const groupId = arbitraryGroupId();
      const articleId = arbitraryDoi();

      const result = pipe(
        [
          evaluationRecorded(groupId, articleId, arbitraryReviewId()),
          evaluationRecorded(groupId, articleId, arbitraryReviewId()),
          evaluationRecorded(groupId, articleId, arbitraryReviewId()),
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
    });
  });

  describe('given consecutive events in which the same group evaluated different articles', () => {
    const laterDate = new Date('2021-09-14 12:00');
    const earlierDate = new Date('2021-09-14 11:00');
    const groupId = arbitraryGroupId();

    const events = [
      evaluationRecorded(groupId, arbitraryDoi(), arbitraryReviewId(), [], earlierDate, arbitraryDate()),
      evaluationRecorded(groupId, arbitraryDoi(), arbitraryReviewId(), [], laterDate, arbitraryDate()),
      evaluationRecorded(groupId, arbitraryDoi(), arbitraryReviewId(), [], earlierDate, arbitraryDate()),
    ];
    const result = pipe(
      events,
      collapseCloseEvents,
    );

    it('collapses into a single feed item', () => {
      expect(result).toHaveLength(1);
    });

    it('collapses into a Group Evaluated Multiple Articles feed item', () => {
      expect(result).toStrictEqual([expect.objectContaining({
        type: 'CollapsedGroupEvaluatedMultipleArticles',
        groupId,
        articleCount: 3,
      })]);
    });

    it('returns the most recent evaluation published date', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          date: laterDate,
        },
      )]);
    });
  });

  describe('given two consecutive series of events in which the same group evaluated two different articles', () => {
    const groupId = arbitraryGroupId();
    const firstArticleId = arbitraryDoi();
    const secondArticleId = arbitraryDoi();
    const laterDate = new Date('2021-09-14 12:00');
    const earlierDate = new Date('2021-09-14 11:00');

    const result = pipe(
      [
        evaluationRecorded(groupId, firstArticleId, arbitraryReviewId(), [], earlierDate, arbitraryDate()),
        evaluationRecorded(groupId, firstArticleId, arbitraryReviewId(), [], earlierDate, arbitraryDate()),
        evaluationRecorded(groupId, secondArticleId, arbitraryReviewId(), [], laterDate, arbitraryDate()),
        evaluationRecorded(groupId, secondArticleId, arbitraryReviewId(), [], laterDate, arbitraryDate()),
      ],
      collapseCloseEvents,
    );

    it('collapses into a single feed item', () => {
      expect(result).toHaveLength(1);
    });

    it('collapses into a Group Evaluated Multiple Articles feed item', () => {
      expect(result).toStrictEqual([expect.objectContaining({
        type: 'CollapsedGroupEvaluatedMultipleArticles',
        groupId,
        articleCount: 2,
      })]);
    });

    it('returns the most recent evaluation published date', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        {
          date: laterDate,
        },
      )]);
    });
  });

  describe('given a group reviewing article 1 twice, then article 2 once, and then article 1 again', () => {
    const groupId = arbitraryGroupId();
    const firstArticleId = arbitraryDoi();
    const secondArticleId = arbitraryDoi();

    const result = pipe(
      [
        evaluationRecorded(groupId, firstArticleId, arbitraryReviewId()),
        evaluationRecorded(groupId, firstArticleId, arbitraryReviewId()),
        evaluationRecorded(groupId, secondArticleId, arbitraryReviewId()),
        evaluationRecorded(groupId, firstArticleId, arbitraryReviewId()),
      ],
      collapseCloseEvents,
    );

    it('collapses into a single feed item', () => {
      expect(result).toHaveLength(1);
    });

    it('collapses into a Group Evaluated Multiple Articles feed item', () => {
      expect(result).toStrictEqual([expect.objectContaining({
        type: 'CollapsedGroupEvaluatedMultipleArticles',
        groupId,
        articleCount: 2,
      })]);
    });
  });

  describe('given consecutive events in which different groups evaluated an article', () => {
    const articleId = arbitraryDoi();

    const events = [
      evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
      evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
    ];
    const result = pipe(
      events,
      collapseCloseEvents,
    );

    it('does not collapse the events', () => {
      expect(result).toHaveLength(events.length);
    });
  });

  describe('given group one evaluates 2 articles separated by group two reviewing an article', () => {
    const groupOne = arbitraryGroupId();
    const groupTwo = arbitraryGroupId();

    const events = [
      evaluationRecorded(groupOne, arbitraryDoi(), arbitraryReviewId()),
      evaluationRecorded(groupTwo, arbitraryDoi(), arbitraryReviewId()),
      evaluationRecorded(groupOne, arbitraryDoi(), arbitraryReviewId()),
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
