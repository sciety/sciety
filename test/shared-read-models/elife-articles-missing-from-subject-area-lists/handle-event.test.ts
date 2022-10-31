/* eslint-disable jest/prefer-lowercase-title */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList } from '../../../src/domain-events';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { elifeGroupId, elifeSubjectAreaListIds } from '../../../src/shared-read-models/elife-articles-missing-from-subject-area-lists/data';
import { handleEvent, initialState, ReadModel } from '../../../src/shared-read-models/elife-articles-missing-from-subject-area-lists/handle-event';
import * as LID from '../../../src/types/list-id';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('handle-event', () => {
  describe('the state machine of a single article', () => {
    const articleId = arbitraryArticleId();
    let currentState: ReadModel;

    describe('when the article is in the unknown state', () => {
      beforeEach(() => {
        currentState = initialState();
      });

      it('EvaluationRecorded -> evaluated', () => {
        const readModel = handleEvent(
          currentState,
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        );

        expect(readModel[articleId.value]).toBe('evaluated');
      });

      it('EvaluationRecorded (not eLife) -> unknown', () => {
        const readModel = handleEvent(
          currentState,
          evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), arbitraryReviewId()),
        );

        expect(readModel[articleId.value]).toBeUndefined();
      });

      it('ArticleAddedToList -> listed', () => {
        const elifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.epidemiologyListId);
        const readModel = handleEvent(
          currentState,
          articleAddedToList(articleId, elifeListId),
        );

        expect(readModel[articleId.value]).toBe('listed');
      });
    });

    describe('when the article is in the evaluated state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it('EvaluationRecorded -> evaluated', () => {
        const readModel = handleEvent(
          currentState,
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        );

        expect(readModel[articleId.value]).toBe('evaluated');
      });

      it('ArticleAddedToList -> listed', () => {
        const elifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.ecologyListId);
        const readModel = handleEvent(
          currentState,
          articleAddedToList(articleId, elifeListId),
        );

        expect(readModel[articleId.value]).toBe('listed');
      });
    });

    describe('when the article is in the listed state', () => {
      const elifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.zoologyListId);

      beforeEach(() => {
        currentState = pipe(
          [
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
            articleAddedToList(articleId, elifeListId),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it('EvaluationRecorded -> listed', () => {
        const readModel = handleEvent(
          currentState,
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
        );

        expect(readModel[articleId.value]).toBe('listed');
      });

      it('ArticleAddedToList -> listed', () => {
        const anotherElifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.immunologyAndInflammationListId);
        const readModel = handleEvent(
          currentState,
          articleAddedToList(articleId, anotherElifeListId),
        );

        expect(readModel[articleId.value]).toBe('listed');
      });
    });
  });

  describe('interactions between different articles', () => {
    describe('when there are multiple evaluations by eLife on articles that have not been added to an eLife subject area list', () => {
      it('considers the articles as evaluated', () => {
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
          [articleId.value]: 'evaluated',
          [articleId2.value]: 'evaluated',
        });
      });
    });
  });
});
