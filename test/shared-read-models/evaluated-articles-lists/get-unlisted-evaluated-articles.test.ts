import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { getUnlistedEvaluatedArticles } from '../../../src/shared-read-models/evaluated-articles-lists/get-unlisted-evaluated-articles';
import { handleEvent, initialState } from '../../../src/shared-read-models/evaluated-articles-lists/handle-event';

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
});
