/* eslint-disable jest/expect-expect */
/* eslint-disable jest/prefer-lowercase-title */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, biorxivCategoryRecorded, DomainEvent } from '../../../src/domain-events';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import { elifeGroupId, elifeSubjectAreaListIds } from '../../../src/shared-read-models/elife-articles-missing-from-subject-area-lists/data';
import {
  ArticleState, handleEvent, initialState, ReadModel,
} from '../../../src/shared-read-models/elife-articles-missing-from-subject-area-lists/handle-event';
import * as LID from '../../../src/types/list-id';
import { arbitraryWord } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('handle-event', () => {
  describe('the state machine of a single article', () => {
    let currentState: ReadModel;
    const articleId = arbitraryArticleId();

    const testNextStateTransition = (_: string, event: DomainEvent, nextState: ArticleState | undefined) => {
      const readModel = handleEvent(currentState, event);

      expect(readModel[articleId.value]).toBe(nextState);
    };

    describe('when the article is in the unknown state', () => {
      const elifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.epidemiologyListId);

      beforeEach(() => {
        currentState = initialState();
      });

      it.each([
        [
          'EvaluationRecorded (eLife) -> evaluated',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          'evaluated' as ArticleState,
        ],
        [
          'EvaluationRecorded (not eLife) -> unknown',
          evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), arbitraryReviewId()),
          undefined,
        ],
        [
          'BiorxivCategoryRecorded -> category-known',
          biorxivCategoryRecorded(articleId, arbitraryWord()),
          'category-known' as ArticleState,
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, elifeListId),
          'listed' as ArticleState,
        ],
      ])('%s', testNextStateTransition);

      it.todo('MedrxivCategoryRecorded -> category-known');
    });

    describe('when the article is in the category-known state', () => {
      it.todo('EvaluationRecorded -> evaluated-and-category-known');

      it.todo('BiorxivCategoryRecorded -> category-known');

      it.todo('MedrxivCategoryRecorded -> category-known');

      it.todo('ArticleAddedToList -> listed');
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

      const elifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.ecologyListId);

      it.each([
        [
          'EvaluationRecorded -> evaluated',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          'evaluated' as ArticleState,
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, elifeListId),
          'listed' as ArticleState,
        ],
      ])('%s', testNextStateTransition);

      it.todo('BiorxivCategoryRecorded -> evaluated-and-category-known');

      it.todo('MedrxivCategoryRecorded -> evaluated-and-category-known');
    });

    describe('when the article is in the evaluated-and-category-known state', () => {
      it.todo('EvaluationRecorded -> evaluated-and-category-known');

      it.todo('BiorxivCategoryRecorded -> evaluated-and-category-known');

      it.todo('MedrxivCategoryRecorded -> evaluated-and-category-known');

      it.todo('ArticleAddedToList -> listed');
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

      const anotherElifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.immunologyAndInflammationListId);

      it.each([
        [
          'EvaluationRecorded -> listed',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          'listed' as ArticleState,
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, anotherElifeListId),
          'listed' as ArticleState,
        ],
      ])('%s', testNextStateTransition);

      it.todo('BiorxivCategoryRecorded -> listed');

      it.todo('MedrxivCategoryRecorded -> listed');
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
