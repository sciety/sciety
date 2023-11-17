/* eslint-disable jest/expect-expect */
/* eslint-disable jest/prefer-lowercase-title */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  handleEvent, initialState, ReadModel, ArticleState, ArticleStateName,
} from '../../../src/read-models/elife-subject-area-lists/handle-event.js';
import { elifeGroupId, elifeSubjectAreaListIds } from '../../../src/read-models/elife-subject-area-lists/data.js';
import { constructEvent, DomainEvent } from '../../../src/domain-events/index.js';
import * as LID from '../../../src/types/list-id.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import { arbitraryGroupId } from '../../types/group-id.helper.js';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper.js';
import { arbitrarySubjectArea } from '../../types/subject-area.helper.js';
import { arbitraryDate } from '../../helpers.js';

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
          constructEvent('EvaluationPublicationRecorded')({
            groupId: elifeGroupId,
            articleId,
            evaluationLocator: arbitraryEvaluationLocator(),
            authors: [],
            publishedAt: arbitraryDate(),
            evaluationType: undefined,
          }),
          'evaluated' as const,
        ],
        [
          'EvaluationRecorded (not eLife) -> unknown',
          constructEvent('EvaluationPublicationRecorded')({
            groupId: arbitraryGroupId(),
            articleId: arbitraryArticleId(),
            evaluationLocator: arbitraryEvaluationLocator(),
            authors: [],
            publishedAt: arbitraryDate(),
            evaluationType: undefined,
          }),
          undefined,
        ],
        [
          'SubjectAreaRecorded -> subject-area-known',
          constructEvent('SubjectAreaRecorded')({ articleId, subjectArea }),
          { name: 'subject-area-known' as const, subjectArea },
        ],
        [
          'ArticleAddedToList -> listed',
          constructEvent('ArticleAddedToList')({ articleId, listId: elifeListId }),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the subject-area-known state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            constructEvent('SubjectAreaRecorded')({ articleId, subjectArea }),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it.each([
        [
          'SubjectAreaRecorded -> subject-area-known',
          constructEvent('SubjectAreaRecorded')({ articleId, subjectArea }),
          { name: 'subject-area-known' as const, subjectArea },
        ],
        [
          'EvaluationRecorded -> evaluated-and-subject-area-known',
          constructEvent('EvaluationPublicationRecorded')({
            groupId: elifeGroupId,
            articleId,
            evaluationLocator: arbitraryEvaluationLocator(),
            authors: [],
            publishedAt: arbitraryDate(),
            evaluationType: undefined,
          }),
          { name: 'evaluated-and-subject-area-known' as const, subjectArea },
        ],
        [
          'ArticleAddedToList -> listed',
          constructEvent('ArticleAddedToList')({ articleId, listId: elifeListId }),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the evaluated state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            constructEvent('EvaluationPublicationRecorded')({
              groupId: elifeGroupId,
              articleId,
              evaluationLocator: arbitraryEvaluationLocator(),
              authors: [],
              publishedAt: arbitraryDate(),
              evaluationType: undefined,
            }),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it.each([
        [
          'EvaluationRecorded -> evaluated',
          constructEvent('EvaluationPublicationRecorded')({
            groupId: elifeGroupId,
            articleId,
            evaluationLocator: arbitraryEvaluationLocator(),
            authors: [],
            publishedAt: arbitraryDate(),
            evaluationType: undefined,
          }),
          'evaluated' as const,
        ],
        [
          'SubjectAreaRecorded -> evaluated-and-subject-area-known',
          constructEvent('SubjectAreaRecorded')({ articleId, subjectArea }),
          { name: 'evaluated-and-subject-area-known' as const, subjectArea },
        ],
        [
          'ArticleAddedToList -> listed',
          constructEvent('ArticleAddedToList')({ articleId, listId: elifeListId }),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the evaluated-and-subject-area-known state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            constructEvent('EvaluationPublicationRecorded')({
              groupId: elifeGroupId,
              articleId,
              evaluationLocator: arbitraryEvaluationLocator(),
              authors: [],
              publishedAt: arbitraryDate(),
              evaluationType: undefined,
            }),
            constructEvent('SubjectAreaRecorded')({ articleId, subjectArea }),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it.each([
        [
          'EvaluationRecorded -> evaluated-and-subject-area-known',
          constructEvent('EvaluationPublicationRecorded')({
            groupId: elifeGroupId,
            articleId,
            evaluationLocator: arbitraryEvaluationLocator(),
            authors: [],
            publishedAt: arbitraryDate(),
            evaluationType: undefined,
          }),
          { name: 'evaluated-and-subject-area-known' as const, subjectArea },
        ],
        [
          'SubjectAreaRecorded -> evaluated-and-subject-area-known',
          constructEvent('SubjectAreaRecorded')({ articleId, subjectArea }),
          { name: 'evaluated-and-subject-area-known' as const, subjectArea },
        ],
        [
          'ArticleAddedToList -> listed',
          constructEvent('ArticleAddedToList')({ articleId, listId: elifeListId }),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the listed state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            constructEvent('EvaluationPublicationRecorded')({
              groupId: elifeGroupId,
              articleId,
              evaluationLocator: arbitraryEvaluationLocator(),
              authors: [],
              publishedAt: arbitraryDate(),
              evaluationType: undefined,
            }),
            constructEvent('ArticleAddedToList')({ articleId, listId: elifeListId }),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      const anotherElifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.immunologyAndInflammationListId);

      it.each([
        [
          'EvaluationRecorded -> listed',
          constructEvent('EvaluationPublicationRecorded')({
            groupId: elifeGroupId,
            articleId,
            evaluationLocator: arbitraryEvaluationLocator(),
            authors: [],
            publishedAt: arbitraryDate(),
            evaluationType: undefined,
          }),
          'listed' as const,
        ],
        [
          'ArticleAddedToList -> listed',
          constructEvent('ArticleAddedToList')({ articleId, listId: anotherElifeListId }),
          'listed' as const,
        ],
        [
          'SubjectAreaRecorded -> listed',
          constructEvent('SubjectAreaRecorded')({ articleId, subjectArea }),
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
            constructEvent('EvaluationPublicationRecorded')({
              groupId: elifeGroupId,
              articleId,
              evaluationLocator: arbitraryEvaluationLocator(),
              authors: [],
              publishedAt: arbitraryDate(),
              evaluationType: undefined,
            }),
            constructEvent('EvaluationPublicationRecorded')({
              groupId: elifeGroupId,
              articleId: articleId2,
              evaluationLocator: arbitraryEvaluationLocator(),
              authors: [],
              publishedAt: arbitraryDate(),
              evaluationType: undefined,
            }),
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
