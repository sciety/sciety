import { pipe } from 'fp-ts/function';
import { CrossrefWork } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/crossref-work';
import {
  enqueueAllRelatedDoisNotYetCollected,
} from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/enqueue-all-related-dois-not-yet-collected';
import { collectWorksIntoStateAndEmptyQueue, initialState, State } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/state';
import * as EDOI from '../../../../src/types/expression-doi';
import { arbitraryString } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

describe('enqueue-all-related-dois-not-yet-collected', () => {
  describe('when there no works', () => {
    const state = pipe(
      [],
      collectWorksIntoStateAndEmptyQueue(initialState(arbitraryExpressionDoi())),
    );
    const result = enqueueAllRelatedDoisNotYetCollected(state);

    it('the collected works are unchanged', () => {
      const alreadyCollectedWorks = new Map();

      expect(result.collectedWorks).toStrictEqual(alreadyCollectedWorks);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });

  describe('when there is one work with no relations', () => {
    const collectedWork: CrossrefWork = {
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
    };
    const state = pipe(
      [collectedWork],
      collectWorksIntoStateAndEmptyQueue(initialState(arbitraryExpressionDoi())),
    );
    const result = enqueueAllRelatedDoisNotYetCollected(state);

    it('the collected works are unchanged', () => {
      const alreadyCollectedWorks: State['collectedWorks'] = new Map([
        [collectedWork.DOI, collectedWork],
      ]);

      expect(result.collectedWorks).toStrictEqual(alreadyCollectedWorks);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });

  describe('when there are two works that are related to each other', () => {
    const collectedWork1: CrossrefWork = {
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
    };
    const collectedWork2: CrossrefWork = {
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
    };
    const state = pipe(
      [collectedWork1, collectedWork2],
      collectWorksIntoStateAndEmptyQueue(initialState(arbitraryExpressionDoi())),
    );

    const result = enqueueAllRelatedDoisNotYetCollected(state);

    it('the collected works are unchanged', () => {
      const alreadyCollectedWorks: State['collectedWorks'] = new Map([
        [collectedWork1.DOI, collectedWork1],
        [collectedWork2.DOI, collectedWork2],
      ]);

      expect(result.collectedWorks).toStrictEqual(alreadyCollectedWorks);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });
});
