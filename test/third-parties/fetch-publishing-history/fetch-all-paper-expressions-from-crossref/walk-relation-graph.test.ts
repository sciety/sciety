import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { arbitraryPostedContentCrossrefWork } from './crossref-work.helper';
import { CrossrefWork, crossrefWorkCodec } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/crossref-work';
import { QueryCrossrefService } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/query-crossref-service';
import {
  collectWorksIntoStateAndEmptyQueue, enqueueInState, initialState, State,
} from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/state';
import { walkRelationGraph } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/walk-relation-graph';
import * as DE from '../../../../src/types/data-error';
import { dummyLogger } from '../../../dummy-logger';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

const mockQueryCrossrefService = (createWork: () => CrossrefWork) => (url: string) => {
  if (url.includes('filter')) {
    const stubbedResponseForFetchWorksThatPointToIndividualWork = { message: { items: [], 'total-results': 0 } };
    return TE.right(stubbedResponseForFetchWorksThatPointToIndividualWork);
  }
  const stubbedResponseForFetchIndividualWork = {
    message: crossrefWorkCodec.encode(createWork()),
  };
  return TE.right(stubbedResponseForFetchIndividualWork);
};

describe('walk-relation-graph', () => {
  let queryCrossrefService: QueryCrossrefService;
  const executeWalkRelationGraph = async (state: State) => walkRelationGraph(
    queryCrossrefService,
    dummyLogger,
    arbitraryExpressionDoi(),
  )(state)();
  let result: E.Either<DE.DataError, ReadonlyArray<CrossrefWork>>;

  describe('when no related works are identified', () => {
    const crossrefWork: CrossrefWork = {
      ...arbitraryPostedContentCrossrefWork(),
      relation: {},
    };
    const state: State = initialState(crossrefWork.DOI);

    beforeEach(async () => {
      queryCrossrefService = mockQueryCrossrefService(() => crossrefWork);
      result = await executeWalkRelationGraph(state);
    });

    it('returns the only collected work on the right', () => {
      expect(result).toStrictEqual(E.right([crossrefWork]));
    });
  });

  describe('when related works are identified', () => {
    const relatedWork = arbitraryPostedContentCrossrefWork();
    const previouslyKnownWork: CrossrefWork = {
      ...arbitraryPostedContentCrossrefWork(),
      relation: {
        'has-version': [
          {
            'id-type': 'doi',
            id: relatedWork.DOI,
          },
        ],
      },
    };

    describe('if one more related CrossrefWork is retrieved by looking up the queue', () => {
      const state: State = pipe(
        [previouslyKnownWork],
        collectWorksIntoStateAndEmptyQueue(initialState(arbitraryExpressionDoi())),
        (s) => enqueueInState(s)([relatedWork.DOI]),
      );

      beforeEach(async () => {
        queryCrossrefService = jest.fn(mockQueryCrossrefService(() => relatedWork));
        result = await executeWalkRelationGraph(state);
      });

      it('returns all collected works on the right', () => {
        expect(result).toStrictEqual(E.right([previouslyKnownWork, relatedWork]));
      });
    });
  });

  describe('if the crossref graph is too big', () => {
    const state = initialState(arbitraryExpressionDoi());

    beforeEach(async () => {
      const createWorkWithArbitraryRelation = (): CrossrefWork => ({
        ...arbitraryPostedContentCrossrefWork(),
        relation: {
          'has-version': [
            {
              'id-type': 'doi',
              id: arbitraryExpressionDoi(),
            },
          ],
        },
      });
      queryCrossrefService = jest.fn(mockQueryCrossrefService(createWorkWithArbitraryRelation));
      result = await executeWalkRelationGraph(state);
    });

    it('returns early', () => {
      expect(result).toStrictEqual(expect.anything());
    });
  });

  describe('if the queue keeps getting populated with a discovered relation that cannot be fetched', () => {
    const state = initialState(arbitraryExpressionDoi('initialqueueitem'));
    const arbitraryWorkWithArbitraryRelation: CrossrefWork = {
      ...arbitraryPostedContentCrossrefWork(),
      DOI: arbitraryExpressionDoi('discoveredwork'),
      relation: {
        'has-version': [
          {
            'id-type': 'doi',
            id: arbitraryExpressionDoi('discoveredrelation'),
          },
        ],
      },
    };

    beforeEach(async () => {
      queryCrossrefService = jest.fn(mockQueryCrossrefService(() => arbitraryWorkWithArbitraryRelation));
      result = await executeWalkRelationGraph(state);
    });

    it('returns early', () => {
      expect(result).toStrictEqual(expect.anything());
    });
  });
});
