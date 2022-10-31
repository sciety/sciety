/* eslint-disable jest/prefer-lowercase-title */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, listCreated } from '../../../src/domain-events';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { elifeGroupId, elifeSubjectAreaListIds } from '../../../src/shared-read-models/elife-articles-missing-from-subject-area-lists/data';
import { handleEvent, initialState } from '../../../src/shared-read-models/elife-articles-missing-from-subject-area-lists/handle-event';
import * as LID from '../../../src/types/list-id';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('handle-event', () => {
  describe('the state machine of a single article', () => {
    const articleId = arbitraryArticleId();

    describe('when the article is in the unknown state', () => {
      const currentState = initialState();

      it('EvaluationRecorded -> missing', () => {
        const readModel = handleEvent(
          currentState,
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        );

        expect(readModel[articleId.value]).toBe('missing');
      });
    });

    describe('when the article is in the missing state', () => {
      const currentState = pipe(
        [
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('EvaluationRecorded -> missing', () => {
        const readModel = handleEvent(
          currentState,
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        );

        expect(readModel[articleId.value]).toBe('missing');
      });

      const cases = pipe(
        elifeSubjectAreaListIds,
        Object.values,
        RA.map((key) => [LID.fromValidatedString(key)]),
      );

      it.each(cases)('EvaluationRecorded -> added', (elifeListId) => {
        const readModel = pipe(
          [
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
            articleAddedToList(articleId, elifeListId),
          ],
          RA.reduce(initialState(), handleEvent),
        );

        expect(readModel).toStrictEqual({ [articleId.value]: 'added' });
      });
    });

    describe('when the article is in the added state', () => {

    });
  });

  describe('interactions between different articles', () => {
    describe('when there are multiple evaluations by eLife on articles that have not been added to an eLife subject area list', () => {
      it('considers the articles as missing', () => {
        const articleId = arbitraryArticleId();
        const articleId2 = arbitraryArticleId();
        const readModel = pipe(
          [
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
            evaluationRecorded(elifeGroupId, articleId2, arbitraryReviewId()),
          ],
          RA.reduce(initialState(), handleEvent),
        );

        expect(readModel).toStrictEqual({
          [articleId.value]: 'missing',
          [articleId2.value]: 'missing',
        });
      });
    });
  });

  describe('when there is an evaluation by eLife on an article that has already been added to an eLife subject area list', () => {
    it('still considers the article as added', () => {
      const articleId = arbitraryArticleId();
      const elifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.zoologyListId);
      const readModel = pipe(
        [
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          articleAddedToList(articleId, elifeListId),
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      expect(readModel).toStrictEqual({ [articleId.value]: 'added' });
    });
  });

  describe('when there is an evaluation by another group', () => {
    it('does not consider the article', () => {
      const readModel = pipe(
        [
          evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), arbitraryReviewId()),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      expect(readModel).toStrictEqual({});
    });
  });

  describe('when the event is not relevant', () => {
    it('does not consider the event', () => {
      const readModel = pipe(
        [
          listCreated(arbitraryListId(), arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      expect(readModel).toStrictEqual({});
    });
  });
});
