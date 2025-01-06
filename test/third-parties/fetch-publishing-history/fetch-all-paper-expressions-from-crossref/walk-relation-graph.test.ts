import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { CrossrefWork } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/crossref-work';
import { State } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/state';
import { walkRelationGraph } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/walk-relation-graph';
import * as DE from '../../../../src/types/data-error';
import { dummyLogger } from '../../../dummy-logger';
import { arbitraryUri } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

describe('walk-relation-graph', () => {
  describe('if the queue is empty', () => {
    const queryCrossrefService = () => TE.right('');
    const crossrefWork: CrossrefWork = {
      type: 'posted-content',
      DOI: arbitraryExpressionDoi(),
      posted: { 'date-parts': [[2021, 10, 3]] },
      resource: { primary: { URL: arbitraryUri() } },
      relation: { },
    };

    const state: State = {
      queue: [],
      collectedWorks: new Map([
        [arbitraryExpressionDoi(), crossrefWork],
      ]),
    };
    let result: E.Either<DE.DataError, ReadonlyArray<CrossrefWork>>;

    beforeEach(async () => {
      result = await walkRelationGraph(
        queryCrossrefService,
        dummyLogger,
        arbitraryExpressionDoi(),
      )(state)();
    });

    it('returns on the right', () => {
      expect(E.isRight(result)).toBe(true);
    });

    it('returns the current collected works', () => {
      expect(result).toStrictEqual(E.right([crossrefWork]));
    });

    it.todo('does not call queryCrossrefService');
  });

  describe('if the queue is not empty', () => {
    describe('if there are currently more than 20 collected works', () => {
      it.todo('returns on the right');

      it.todo('returns the current collected works');

      it.todo('does not call queryCrossrefService');
    });

    describe('if there are 20 or fewer collected works', () => {
      it.todo('tbd');
    });
  });
});
