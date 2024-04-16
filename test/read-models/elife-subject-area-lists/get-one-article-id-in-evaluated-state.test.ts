import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { elifeGroupId } from '../../../src/read-models/elife-subject-area-lists/data';
import { getOneArticleIdInEvaluatedState } from '../../../src/read-models/elife-subject-area-lists/get-one-article-id-in-evaluated-state';
import {
  handleEvent, initialState,
} from '../../../src/read-models/elife-subject-area-lists/handle-event';
import * as EDOI from '../../../src/types/expression-doi';
import { arbitraryDate } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';

describe('get-one-article-id-in-evaluated-state', () => {
  describe('given a biorxiv article that has been evaluated by eLife', () => {
    const expressionDoi = EDOI.fromValidatedString('10.1101/2022.06.22.497259');

    const readModel = pipe(
      [
        constructEvent('EvaluationPublicationRecorded')({
          groupId: elifeGroupId,
          articleId: expressionDoi,
          evaluationLocator: arbitraryEvaluationLocator(),
          authors: [],
          publishedAt: arbitraryDate(),
          evaluationType: undefined,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns one article in evaluated state', () => {
      expect(getOneArticleIdInEvaluatedState(readModel)()).toStrictEqual(O.some(expressionDoi));
    });
  });

  describe('given a researchsquare article that has been evaluated by eLife', () => {
    const expressionDoi = EDOI.fromValidatedString('10.21203/rs.3.rs-2407778/v1');

    const readModel = pipe(
      [
        constructEvent('EvaluationPublicationRecorded')({
          groupId: elifeGroupId,
          articleId: expressionDoi,
          evaluationLocator: arbitraryEvaluationLocator(),
          authors: [],
          publishedAt: arbitraryDate(),
          evaluationType: undefined,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns no articles in the evaluated state', () => {
      expect(getOneArticleIdInEvaluatedState(readModel)()).toStrictEqual(O.none);
    });
  });
});
