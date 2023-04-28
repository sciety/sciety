/* eslint-disable jest/expect-expect */
/* eslint-disable jest/prefer-lowercase-title */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState, ReadModel } from '../../../src/add-article-to-elife-subject-area-list/read-model';
import { elifeGroupId, elifeSubjectAreaListIds } from '../../../src/add-article-to-elife-subject-area-list/read-model/data';
import { ArticleState, ArticleStateName } from '../../../src/add-article-to-elife-subject-area-list/read-model/handle-event';
import {
  articleAddedToList, DomainEvent, subjectAreaRecorded,
} from '../../../src/domain-events';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import * as LID from '../../../src/types/list-id';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';
import { arbitrarySubjectArea } from '../../types/subject-area.helper';
import { arbitraryDate } from '../../helpers';

describe('handle-event', () => {
  describe('the state machine of a single article', () => {
    let currentState: ReadModel;
    const articleId = arbitraryArticleId();
    const elifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.epidemiologyListId);
    const subjectArea = arbitrarySubjectArea();

    const testNextStateTransition = (
      _: string,
      event: DomainEvent,
      nextStateOrNextStateName: ArticleStateName | undefined | ArticleState,
    ) => {
      const readModel = handleEvent(currentState, event);

      if (typeof nextStateOrNextStateName === 'string') {
        expect(readModel[articleId.value].name).toStrictEqual(nextStateOrNextStateName);
      } else if (typeof nextStateOrNextStateName === 'object') {
        expect(readModel[articleId.value]).toStrictEqual(nextStateOrNextStateName);
      } else {
        expect(readModel[articleId.value]).toBeUndefined();
      }
    };

    describe('when the article is in the unknown state', () => {
      beforeEach(() => {
        currentState = initialState();
      });

      it.each([
        [
          'EvaluationRecorded (eLife) -> evaluated',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
          'evaluated' as const,
        ],
        [
          'EvaluationRecorded (not eLife) -> unknown',
          evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), arbitraryReviewId(), [], arbitraryDate()),
          undefined,
        ],
        [
          'SubjectAreaRecorded -> subject-area-known',
          subjectAreaRecorded(articleId, subjectArea),
          { name: 'subject-area-known' as const, subjectArea },
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, elifeListId),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the subject-area-known state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            subjectAreaRecorded(articleId, subjectArea),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it.each([
        [
          'SubjectAreaRecorded -> subject-area-known',
          subjectAreaRecorded(articleId, subjectArea),
          { name: 'subject-area-known' as const, subjectArea },
        ],
        [
          'EvaluationRecorded -> evaluated-and-subject-area-known',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
          { name: 'evaluated-and-subject-area-known' as const, subjectArea },
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, elifeListId),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the evaluated state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it.each([
        [
          'EvaluationRecorded -> evaluated',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
          'evaluated' as const,
        ],
        [
          'SubjectAreaRecorded -> evaluated-and-subject-area-known',
          subjectAreaRecorded(articleId, subjectArea),
          { name: 'evaluated-and-subject-area-known' as const, subjectArea },
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, elifeListId),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the evaluated-and-subject-area-known state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
            subjectAreaRecorded(articleId, subjectArea),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it.each([
        [
          'EvaluationRecorded -> evaluated-and-subject-area-known',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
          { name: 'evaluated-and-subject-area-known' as const, subjectArea },
        ],
        [
          'SubjectAreaRecorded -> evaluated-and-subject-area-known',
          subjectAreaRecorded(articleId, subjectArea),
          { name: 'evaluated-and-subject-area-known' as const, subjectArea },
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, elifeListId),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the listed state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
            articleAddedToList(articleId, elifeListId),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      const anotherElifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.immunologyAndInflammationListId);

      it.each([
        [
          'EvaluationRecorded -> listed',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
          'listed' as const,
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, anotherElifeListId),
          'listed' as const,
        ],
        [
          'SubjectAreaRecorded -> listed',
          subjectAreaRecorded(articleId, arbitrarySubjectArea()),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });
  });

  describe('interactions between different articles', () => {
    describe('when there are multiple evaluations by eLife on articles that have not been added to an eLife subject area list', () => {
      it('considers the articles as evaluated', () => {
        const articleId = arbitraryArticleId();
        const articleId2 = arbitraryArticleId();
        const readModel = pipe(
          [
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
            evaluationRecorded(elifeGroupId, articleId2, arbitraryReviewId(), [], arbitraryDate()),
          ],
          RA.reduce(initialState(), handleEvent),
        );

        expect(readModel).toStrictEqual({
          [articleId.value]: { name: 'evaluated' },
          [articleId2.value]: { name: 'evaluated' },
        });
      });
    });
  });
});
