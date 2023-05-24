import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, evaluationRecorded, incorrectlyRecordedEvaluationErased } from '../../../src/domain-events';
import { arbitraryDate } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/article-activity';
import { getActivityForDoi } from '../../../src/shared-read-models/article-activity/get-activity-for-doi';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';

describe('get-activity-for-doi', () => {
  const articleId = arbitraryArticleId();

  describe('when an article has no evaluations and is in no list', () => {
    describe('because it has never been added to a list', () => {
      const readmodel = pipe(
        [],
        RA.reduce(initialState(), handleEvent),
      );

      it('article has no activity', () => {
        expect(getActivityForDoi(readmodel)(articleId)).toStrictEqual({
          articleId,
          latestActivityAt: O.none,
          evaluationCount: 0,
          listMembershipCount: 0,
        });
      });
    });

    describe('because it has been added and removed from a list', () => {
      const listId = arbitraryListId();
      const readmodel = pipe(
        [
          constructEvent('ArticleAddedToList')({ articleId, listId }),
          constructEvent('ArticleRemovedFromList')({ articleId, listId }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 0', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(0);
      });
    });

    describe('because it has had an evaluation recorded and erased', () => {
      const evaluation = arbitraryRecordedEvaluation();
      const readmodel = pipe(
        [
          evaluationRecorded(
            evaluation.groupId,
            evaluation.articleId,
            evaluation.reviewId,
            evaluation.authors,
            evaluation.publishedAt,
          ),
          incorrectlyRecordedEvaluationErased(evaluation.reviewId),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('the article has no evaluations', () => {
        expect(getActivityForDoi(readmodel)(evaluation.articleId).evaluationCount).toBe(0);
      });
    });
  });

  describe('when an article has one or more evaluations', () => {
    const earlierPublishedDate = new Date('1900');
    const laterPublishedDate = new Date('2000');

    describe('and the evaluations are recorded in order of publication', () => {
      const readmodel = pipe(
        [
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            arbitraryEvaluationLocator(),
            [],
            earlierPublishedDate,
            arbitraryDate(),
          ),
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            arbitraryEvaluationLocator(),
            [],
            laterPublishedDate,
            arbitraryDate(),
          ),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the activity for that article', () => {
        expect(getActivityForDoi(readmodel)(articleId)).toStrictEqual(expect.objectContaining({
          latestActivityAt: O.some(laterPublishedDate),
          evaluationCount: 2,
        }));
      });
    });

    describe('and the evaluations are NOT recorded in order of publication', () => {
      const readmodel = pipe(
        [
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            arbitraryEvaluationLocator(),
            [],
            laterPublishedDate,
            arbitraryDate(),
          ),
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            arbitraryEvaluationLocator(),
            [],
            earlierPublishedDate,
            arbitraryDate(),
          ),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the activity for that article', () => {
        expect(getActivityForDoi(readmodel)(articleId)).toStrictEqual(expect.objectContaining({
          latestActivityAt: O.some(laterPublishedDate),
          evaluationCount: 2,
        }));
      });
    });

    describe('and one of the evaluations has been erased', () => {
      const evaluationLocator = arbitraryEvaluationLocator();
      const readmodel = pipe(
        [
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            evaluationLocator,
            [],
            laterPublishedDate,
            arbitraryDate(),
          ),
          evaluationRecorded(
            arbitraryGroupId(),
            articleId,
            arbitraryEvaluationLocator(),
            [],
            earlierPublishedDate,
            arbitraryDate(),
          ),
          incorrectlyRecordedEvaluationErased(evaluationLocator),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('the evaluation count reflects the erasure', () => {
        expect(getActivityForDoi(readmodel)(articleId).evaluationCount).toBe(1);
      });

      it('the latest activity reflects the erasure', () => {
        expect(getActivityForDoi(readmodel)(articleId).latestActivityAt).toStrictEqual(O.some(earlierPublishedDate));
      });
    });
  });

  describe('when an article appears in one list', () => {
    describe('and the article has been added to a single list and not removed', () => {
      const readmodel = pipe(
        [
          constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(1);
      });
    });

    describe('and the article was added and removed from a different list', () => {
      const listAId = arbitraryListId();
      const listBId = arbitraryListId();
      const readmodel = pipe(
        [
          constructEvent('ArticleAddedToList')({ articleId, listId: listAId }),
          constructEvent('ArticleRemovedFromList')({ articleId, listId: listAId }),
          constructEvent('ArticleAddedToList')({ articleId, listId: listBId }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(1);
      });
    });

    describe('added to a list, after being evaluated', () => {
      const readmodel = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), articleId, arbitraryEvaluationLocator(), [], arbitraryDate()),
          constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(1);
      });

      it('has an evaluationCount of 1', () => {
        expect(getActivityForDoi(readmodel)(articleId).evaluationCount).toBe(1);
      });
    });
  });

  describe('when an article appears in multiple lists', () => {
    describe('in two different lists', () => {
      const readmodel = pipe(
        [
          constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
          constructEvent('ArticleAddedToList')({ articleId, listId: arbitraryListId() }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('has a listMemberShipCount of 2', () => {
        expect(getActivityForDoi(readmodel)(articleId).listMembershipCount).toBe(2);
      });
    });
  });
});
