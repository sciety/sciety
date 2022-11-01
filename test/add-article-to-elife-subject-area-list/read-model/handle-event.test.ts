/* eslint-disable jest/expect-expect */
/* eslint-disable jest/prefer-lowercase-title */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState, ReadModel } from '../../../src/add-article-to-elife-subject-area-list/read-model';
import { elifeGroupId, elifeSubjectAreaListIds } from '../../../src/add-article-to-elife-subject-area-list/read-model/data';
import { ArticleState } from '../../../src/add-article-to-elife-subject-area-list/read-model/handle-event';
import {
  articleAddedToList, biorxivCategoryRecorded, DomainEvent, medrxivCategoryRecorded,
} from '../../../src/domain-events';
import { evaluationRecorded } from '../../../src/domain-events/evaluation-recorded-event';
import * as LID from '../../../src/types/list-id';
import { arbitraryWord } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('handle-event', () => {
  describe('the state machine of a single article', () => {
    let currentState: ReadModel;
    const articleId = arbitraryArticleId();
    const elifeListId = LID.fromValidatedString(elifeSubjectAreaListIds.epidemiologyListId);

    const testNextStateTransition = (_: string, event: DomainEvent, nextState: ArticleState | undefined) => {
      const readModel = handleEvent(currentState, event);

      expect(readModel[articleId.value]).toBe(nextState);
    };

    describe('when the article is in the unknown state', () => {
      beforeEach(() => {
        currentState = initialState();
      });

      it.each([
        [
          'EvaluationRecorded (eLife) -> evaluated',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          'evaluated' as const,
        ],
        [
          'EvaluationRecorded (not eLife) -> unknown',
          evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), arbitraryReviewId()),
          undefined,
        ],
        [
          'BiorxivCategoryRecorded -> category-known',
          biorxivCategoryRecorded(articleId, arbitraryWord()),
          'category-known' as const,
        ],
        [
          'MedrxivCategoryRecorded -> category-known',
          medrxivCategoryRecorded(articleId, arbitraryWord()),
          'category-known' as const,
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, elifeListId),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the category-known state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            biorxivCategoryRecorded(articleId, arbitraryWord()),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it.each([
        [
          'BiorxivCategoryRecorded -> category-known',
          biorxivCategoryRecorded(articleId, arbitraryWord()),
          'category-known' as const,
        ],
        [
          'MedrxivCategoryRecorded -> category-known',
          medrxivCategoryRecorded(articleId, arbitraryWord()),
          'category-known' as const,
        ],
        [
          'EvaluationRecorded -> evaluated-and-category-known',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          'evaluated-and-category-known' as const,
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
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it.each([
        [
          'EvaluationRecorded -> evaluated',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          'evaluated' as const,
        ],
        [
          'BiorxivCategoryRecorded -> evaluated-and-category-known',
          biorxivCategoryRecorded(articleId, arbitraryWord()),
          'evaluated-and-category-known' as const,
        ],
        [
          'MedrxivCategoryRecorded -> evaluated-and-category-known',
          medrxivCategoryRecorded(articleId, arbitraryWord()),
          'evaluated-and-category-known' as const,
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, elifeListId),
          'listed' as const,
        ],
      ])('%s', testNextStateTransition);
    });

    describe('when the article is in the evaluated-and-category-known state', () => {
      beforeEach(() => {
        currentState = pipe(
          [
            evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
            medrxivCategoryRecorded(articleId, arbitraryWord()),
          ],
          RA.reduce(initialState(), handleEvent),
        );
      });

      it.each([
        [
          'EvaluationRecorded -> evaluated-and-category-known',
          evaluationRecorded(elifeGroupId, articleId, arbitraryReviewId()),
          'evaluated-and-category-known' as const,
        ],
        [
          'BiorxivCategoryRecorded -> evaluated-and-category-known',
          biorxivCategoryRecorded(articleId, arbitraryWord()),
          'evaluated-and-category-known' as const,
        ],
        [
          'MedrxivCategoryRecorded -> evaluated-and-category-known',
          medrxivCategoryRecorded(articleId, arbitraryWord()),
          'evaluated-and-category-known' as const,
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
          'listed' as const,
        ],
        [
          'ArticleAddedToList -> listed',
          articleAddedToList(articleId, anotherElifeListId),
          'listed' as const,
        ],
        [
          'BiorxivCategoryRecorded -> listed',
          biorxivCategoryRecorded(articleId, arbitraryWord()),
          'listed' as const,
        ],
        [
          'MedrxivCategoryRecorded -> listed',
          medrxivCategoryRecorded(articleId, arbitraryWord()),
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
