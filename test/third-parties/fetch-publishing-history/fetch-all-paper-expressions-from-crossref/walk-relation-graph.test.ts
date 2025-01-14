import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { arbitraryPostedContentCrossrefWork } from './crossref-work.helper';
import { CrossrefWork, crossrefWorkCodec } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/crossref-work';
import { QueryCrossrefService } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/query-crossref-service';
import {
  initialState, State,
} from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/state';
import { walkRelationGraph } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/walk-relation-graph';
import * as DE from '../../../../src/types/data-error';
import * as EDOI from '../../../../src/types/expression-doi';
import { dummyLogger } from '../../../dummy-logger';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

const mockQueryCrossrefService = (createWork: (url: string) => CrossrefWork) => (url: string) => {
  if (url.includes('filter')) {
    const stubbedResponseForFetchWorksThatPointToIndividualWork = { message: { items: [], 'total-results': 0 } };
    return TE.right(stubbedResponseForFetchWorksThatPointToIndividualWork);
  }
  const stubbedResponseForFetchIndividualWork = {
    message: crossrefWorkCodec.encode(createWork(url)),
  };
  return TE.right(stubbedResponseForFetchIndividualWork);
};

describe('walk-relation-graph', () => {
  let queryCrossrefService: QueryCrossrefService;
  const executeWalkRelationGraph = async (
    state: State,
    recursionLimit = 1000,
    collectedWorksSizeLimit = 1000,
  ) => walkRelationGraph(
    queryCrossrefService,
    dummyLogger,
    arbitraryExpressionDoi(),
    recursionLimit,
    collectedWorksSizeLimit,
  )(state)();
  let result: E.Either<DE.DataError | 'too-much-recursion', ReadonlyArray<CrossrefWork>>;

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

    it('returns the only discovered work on the right', () => {
      expect(result).toStrictEqual(E.right([crossrefWork]));
    });
  });

  describe('when one related work is identified', () => {
    const secondWorkToBeDiscovered: CrossrefWork = {
      ...arbitraryPostedContentCrossrefWork('second-work-to-be-discovered'),
      relation: {},
    };
    const firstWorkToBeDiscovered: CrossrefWork = {
      ...arbitraryPostedContentCrossrefWork('first-work-to-be-discovered'),
      relation: {
        'has-version': [
          {
            'id-type': 'doi',
            id: secondWorkToBeDiscovered.DOI,
          },
        ],
      },
    };

    const state: State = initialState(firstWorkToBeDiscovered.DOI);

    beforeEach(async () => {
      queryCrossrefService = jest.fn(mockQueryCrossrefService((url) => {
        if (url.includes(firstWorkToBeDiscovered.DOI)) {
          return firstWorkToBeDiscovered;
        }
        if (url.includes(secondWorkToBeDiscovered.DOI)) {
          return secondWorkToBeDiscovered;
        }
        throw new Error(`Asking crossref for an individual work at ${url}`);
      }));
      result = await executeWalkRelationGraph(state);
    });

    it('returns all discovered works on the right', () => {
      expect(result).toStrictEqual(E.right([firstWorkToBeDiscovered, secondWorkToBeDiscovered]));
    });
  });

  describe('if every work that is discovered has two relations to works not yet collected', () => {
    const state = initialState(arbitraryExpressionDoi());

    const createWorkWithArbitraryRelation = (url: string): CrossrefWork => {
      const doi = EDOI.fromValidatedString(url.replace('https://api.crossref.org/works/', ''));
      return {
        ...arbitraryPostedContentCrossrefWork(),
        DOI: doi,
        relation: {
          'has-version': [
            {
              'id-type': 'doi',
              id: arbitraryExpressionDoi(),
            },
            {
              'id-type': 'doi',
              id: arbitraryExpressionDoi(),
            },
          ],
        },
      };
    };

    beforeEach(async () => {
      queryCrossrefService = jest.fn(mockQueryCrossrefService(createWorkWithArbitraryRelation));
      result = await executeWalkRelationGraph(state, 1000, 10);
    });

    it('returns early on the right', () => {
      expect(E.isRight(result)).toBe(true);
    });
  });

  describe('when the recursion levels exceed the limit', () => {
    const state = initialState(arbitraryExpressionDoi('initialqueueitem'));
    const createWorkWithArbitraryRelation = (url: string): CrossrefWork => {
      const doi = EDOI.fromValidatedString(url.replace('https://api.crossref.org/works/', ''));
      return {
        ...arbitraryPostedContentCrossrefWork(),
        DOI: doi,
        relation: {
          'has-version': [
            {
              'id-type': 'doi',
              id: arbitraryExpressionDoi(),
            },
          ],
        },
      };
    };

    beforeEach(async () => {
      const recursionLimit = 5;
      queryCrossrefService = jest.fn(mockQueryCrossrefService(createWorkWithArbitraryRelation));
      result = await executeWalkRelationGraph(state, recursionLimit);
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
