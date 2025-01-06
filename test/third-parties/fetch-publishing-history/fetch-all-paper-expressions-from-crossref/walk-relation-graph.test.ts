import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CrossrefWork } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/crossref-work';
import { QueryCrossrefService } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/query-crossref-service';
import { State } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/state';
import { walkRelationGraph } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/walk-relation-graph';
import * as DE from '../../../../src/types/data-error';
import { dummyLogger } from '../../../dummy-logger';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

const arbitraryCrossrefWork = (): CrossrefWork => ({
  type: 'posted-content',
  DOI: arbitraryExpressionDoi(),
  posted: { 'date-parts': [[2021, 10, 3]] },
  resource: { primary: { URL: arbitraryUri() } },
  relation: { },
});

describe('walk-relation-graph', () => {
  let queryCrossrefService: QueryCrossrefService;

  const executeWalkRelationGraph = async (state: State) => walkRelationGraph(
    queryCrossrefService,
    dummyLogger,
    arbitraryExpressionDoi(),
  )(state)();

  describe('if the queue is empty', () => {
    const crossrefWork = arbitraryCrossrefWork();

    const state: State = {
      queue: [],
      collectedWorks: new Map([
        [arbitraryExpressionDoi(), crossrefWork],
      ]),
    };
    let result: E.Either<DE.DataError, ReadonlyArray<CrossrefWork>>;

    beforeEach(async () => {
      queryCrossrefService = jest.fn(() => TE.right(''));
      result = await executeWalkRelationGraph(state);
    });

    it('returns the current collected works on the right', () => {
      expect(result).toStrictEqual(E.right([crossrefWork]));
    });

    it('does not call queryCrossrefService', () => {
      expect(queryCrossrefService).not.toHaveBeenCalled();
    });
  });

  describe('if the queue is not empty', () => {
    describe('if there are currently more than 20 collected works', () => {
      const crossrefWorks = Array.from({ length: 21 }, arbitraryCrossrefWork);

      const state: State = {
        queue: [arbitraryString()],
        collectedWorks: pipe(
          crossrefWorks,
          RA.map((work) => [work.DOI, work] as const),
          (entries) => new Map(entries),
        ),
      };
      let result: E.Either<DE.DataError, ReadonlyArray<CrossrefWork>>;

      beforeEach(async () => {
        queryCrossrefService = jest.fn(() => TE.right(''));
        result = await executeWalkRelationGraph(state);
      });

      it('returns the current collected works on the right', () => {
        expect(result).toStrictEqual(E.right(crossrefWorks));
      });

      it('does not call queryCrossrefService', () => {
        expect(queryCrossrefService).not.toHaveBeenCalled();
      });
    });

    describe('if there are currently 20 or fewer collected works', () => {
      describe('when there is one currently collected work', () => {
        describe('if one more CrossrefWork is retrieved by looking up the queue', () => {
          it.todo('returns two collected works on the right');
        });
      });
    });
  });
});
