import { pipe } from 'fp-ts/function';
import {
  enqueueAllRelatedDoisNotYetCollected,
} from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/enqueue-all-related-dois-not-yet-collected';
import { collectWorksIntoStateAndEmptyQueue, initialState, State } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/state';
import * as EDOI from '../../../../src/types/expression-doi';
import { arbitraryString } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

describe('enqueue-all-related-dois-not-yet-collected', () => {
  describe('when there no records', () => {
    const initialRecords = new Map();
    const state = pipe(
      [],
      collectWorksIntoStateAndEmptyQueue(initialState(arbitraryExpressionDoi())),
    );
    const result = enqueueAllRelatedDoisNotYetCollected(state);

    it('the collected records are unchanged', () => {
      expect(result.collectedWorks).toStrictEqual(initialRecords);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });

  describe('when there is one record with no relations', () => {
    const initialRecords: State['collectedWorks'] = new Map([
      [EDOI.fromValidatedString('10.21203/rs.3.rs-1828415/v2'), {
        type: 'posted-content',
        DOI: EDOI.fromValidatedString('10.21203/rs.3.rs-1828415/v2'),
        posted: {
          'date-parts': [[2023, 12, 7]],
        },
        resource: {
          primary: {
            URL: arbitraryString(),
          },
        },
        relation: {},
      }],
    ]);
    const result = enqueueAllRelatedDoisNotYetCollected({ collectedWorks: initialRecords, queue: [] });

    it('the collected records are unchanged', () => {
      expect(result.collectedWorks).toStrictEqual(initialRecords);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });

  describe('when there are two records that are related to each other', () => {
    const initialRecords: State['collectedWorks'] = new Map([
      [EDOI.fromValidatedString('10.21203/rs.3.rs-1828415/v2'), {
        type: 'posted-content',
        DOI: EDOI.fromValidatedString('10.21203/rs.3.rs-1828415/v2'),
        posted: {
          'date-parts': [[2023, 12, 7]],
        },
        resource: {
          primary: {
            URL: arbitraryString(),
          },
        },
        relation: {
          'is-version-of': [{
            'id-type': 'doi' as const,
            id: EDOI.fromValidatedString('10.21203/rs.3.rs-1828415/v1'),
          }],
        },
      }],
      [EDOI.fromValidatedString('10.21203/rs.3.rs-1828415/v1'), {
        type: 'posted-content',
        DOI: EDOI.fromValidatedString('10.21203/rs.3.rs-1828415/v1'),
        posted: {
          'date-parts': [[2023, 12, 7]],
        },
        resource: {
          primary: {
            URL: arbitraryString(),
          },
        },
        relation: {
          'has-version': [{
            'id-type': 'doi' as const,
            id: EDOI.fromValidatedString('10.21203/rs.3.rs-1828415/v2'),
          }],
        },
      }],
    ]);
    const result = enqueueAllRelatedDoisNotYetCollected({ collectedWorks: initialRecords, queue: [] });

    it('the collected records are unchanged', () => {
      expect(result.collectedWorks).toStrictEqual(initialRecords);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });
});
