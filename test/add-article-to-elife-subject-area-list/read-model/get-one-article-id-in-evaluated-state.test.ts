import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  elifeGroupId, handleEvent, initialState,
} from '../../../src/add-article-to-elife-subject-area-list/read-model';
import { constructEvent } from '../../../src/domain-events';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryDate } from '../../helpers';
import { getOneArticleIdInEvaluatedState } from '../../../src/add-article-to-elife-subject-area-list/read-model/get-one-article-id-in-evaluated-state';
import { Doi } from '../../../src/types/doi';

describe('get-one-article-id-in-evaluated-state', () => {
  describe('given a bunch of events', () => {
    const articleId = new Doi('10.1101/2022.06.22.497259');

    const readModel = pipe(
      [
        constructEvent('EvaluationRecorded')({
          groupId: elifeGroupId,
          articleId,
          evaluationLocator: arbitraryEvaluationLocator(),
          authors: [],
          publishedAt: arbitraryDate(),
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns one article in evaluated state', () => {
      expect(getOneArticleIdInEvaluatedState(readModel)()).toStrictEqual(O.some(articleId));
    });
  });
});
