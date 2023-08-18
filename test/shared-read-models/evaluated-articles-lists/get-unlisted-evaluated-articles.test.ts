import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { getUnlistedEvaluatedArticles } from '../../../src/shared-read-models/evaluated-articles-lists/get-unlisted-evaluated-articles';
import { handleEvent, initialState } from '../../../src/shared-read-models/evaluated-articles-lists/handle-event';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-publication-recorded-event.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('get-unlisted-evaluated-articles', () => {
  describe('article lifecycles', () => {
    const articleId = arbitraryDoi();
    const groupId = arbitraryGroupId();
    const listId = arbitraryListId();
    const listIdentified = constructEvent('EvaluatedArticlesListSpecified')({ listId, groupId });
    const articleEvaluated = {
      ...arbitraryEvaluationPublicationRecordedEvent(),
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
      [[articleEvaluated, listIdentified], true],
      [[articleEvaluated, articleAdded], false],
      [[listIdentified, articleEvaluated], true],
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

        expect(queryOutcome.includes(articleId.value)).toStrictEqual(expectedOutcome);
      });
    });
  });
});
