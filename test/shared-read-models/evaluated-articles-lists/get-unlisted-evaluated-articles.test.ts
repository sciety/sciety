import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { getUnlistedEvaluatedArticles } from '../../../src/shared-read-models/evaluated-articles-lists/get-unlisted-evaluated-articles';
import { handleEvent, initialState } from '../../../src/shared-read-models/evaluated-articles-lists/handle-event';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryEvaluationRecordedEvent } from '../../types/evaluation-recorded-event.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('get-unlisted-evaluated-articles', () => {
  describe('given an article and a group with no previous activity', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('the article IS NOT reported as work', () => {
      expect(getUnlistedEvaluatedArticles(readmodel)()).toStrictEqual([]);
    });

    describe('when the group\'s list is identified', () => {
      it.todo('the article IS NOT reported as work');

      describe('and then the article is added to the group\'s list', () => {
        it.todo('the article IS NOT reported as work');

        describe('and then the group evaluates the article', () => {
          it.todo('the article IS NOT reported as work');
        });
      });

      describe('and then the article is evaluated by the group', () => {
        it.todo('the article IS reported as work');

        describe('and then the article is added to the list', () => {
          it.todo('the article IS NOT reported as work');
        });
      });
    });

    describe('when the article is added to the group\'s list', () => {
      it.todo('the article IS NOT reported as work');

      describe('and then the group\'s list is identified', () => {
        it.todo('the article IS NOT reported as work');

        describe('and then the group evaluates the article', () => {
          it.todo('the article IS NOT reported as work');
        });
      });

      describe('and then the article is evaluated by the group', () => {
        it.todo('the article IS NOT reported as work');

        describe('and then the group\'s list is identified', () => {
          it.todo('the article IS NOT reported as work');
        });
      });
    });

    describe('when the article is evaluated by the group', () => {
      it.todo('the article IS NOT reported as work');

      describe('and then the group\'s list is identified', () => {
        it.todo('the article IS reported as work');

        describe('and then the article is added to the group\'s list', () => {
          it.todo('the article IS NOT reported as work');
        });
      });

      describe('and then the article is added to the group\'s list', () => {
        it.todo('the article IS NOT reported as work');

        describe('and then the group\'s list is identified', () => {
          it.todo('the article IS NOT reported as work');
        });
      });
    });
  });

  describe('article lifecycles', () => {
    const articleId = arbitraryDoi();
    const groupId = arbitraryGroupId();
    const listId = arbitraryListId();
    const listIdentified = constructEvent('EvaluatedArticlesListSpecified')({ listId, groupId });
    const articleEvaluated = {
      ...arbitraryEvaluationRecordedEvent(),
      articleId,
      groupId,
    };
    const articleAdded = constructEvent('ArticleAddedToList')({ articleId, listId });

    const summarise = (es: ReadonlyArray<DomainEvent>) => pipe(
      es,
      RA.map((e) => e.type),
      (ts) => `[${ts.join(' -> ')}]`,
    );

    describe.each([
      [[], false],
      [[listIdentified], false],
      [[articleEvaluated], false],
      [[articleAdded], false],
      [[articleAdded, listIdentified], false],
      [[articleAdded, articleEvaluated], false],
      // [[articleEvaluated, listIdentified], true],
      [[articleEvaluated, articleAdded], false],
      // [[listIdentified, articleEvaluated], true],
      [[listIdentified, articleAdded], false],
      [[listIdentified, articleAdded, articleEvaluated], false],
      [[listIdentified, articleEvaluated, articleAdded], false],
      [[articleEvaluated, listIdentified, articleAdded], false],
      [[articleEvaluated, articleAdded, listIdentified], false],
      [[articleAdded, articleEvaluated, listIdentified], false],
      [[articleAdded, listIdentified, articleEvaluated], false],
    ])('an article with lifecycle', (eventHistory, expectedOutcome) => {
      it(`${summarise(eventHistory)} is${expectedOutcome ? '' : ' not'} listed as work for the saga`, () => {
        const queryOutcome = pipe(
          eventHistory,
          RA.reduce(initialState(), handleEvent),
          getUnlistedEvaluatedArticles,
        )();

        expect(queryOutcome.includes(articleId)).toStrictEqual(expectedOutcome);
      });
    });
  });
});
