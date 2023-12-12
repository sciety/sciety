import { CrossrefRecord, enqueueAllRelatedDoisNotYetCollected } from '../../../src/third-parties/crossref/fetch-all-paper-expressions-from-crossref';
import { arbitraryString } from '../../helpers';

describe('enqueue-all-related-dois-not-yet-collected', () => {
  describe('when there no records', () => {
    const initialRecords = new Map();
    const result = enqueueAllRelatedDoisNotYetCollected({ collectedRecords: initialRecords, queue: [] });

    it('the collected records are unchanged', () => {
      expect(result.collectedRecords).toStrictEqual(initialRecords);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });

  describe('when there is one record with no relations', () => {
    const initialRecords = new Map<string, CrossrefRecord>([
      ['10.21203/rs.3.rs-1828415/v2', {
        message: {
          DOI: '10.21203/rs.3.rs-1828415/v2',
          posted: {
            'date-parts': [[2023, 12, 7]],
          },
          resource: {
            primary: {
              URL: arbitraryString(),
            },
          },
          relation: {},
        },
      }],
    ]);
    const result = enqueueAllRelatedDoisNotYetCollected({ collectedRecords: initialRecords, queue: [] });

    it('the collected records are unchanged', () => {
      expect(result.collectedRecords).toStrictEqual(initialRecords);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });

  describe('when there are two records that are related to each other', () => {
    const initialRecords = new Map<string, CrossrefRecord>([
      ['10.21203/rs.3.rs-1828415/v2', {
        message: {
          DOI: '10.21203/rs.3.rs-1828415/v2',
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
              id: '10.21203/rs.3.rs-1828415/v1',
            }],
          },
        },
      }],
      ['10.21203/rs.3.rs-1828415/v1', {
        message: {
          DOI: '10.21203/rs.3.rs-1828415/v1',
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
              id: '10.21203/rs.3.rs-1828415/v2',
            }],
          },
        },
      }],
    ]);
    const result = enqueueAllRelatedDoisNotYetCollected({ collectedRecords: initialRecords, queue: [] });

    it('the collected records are unchanged', () => {
      expect(result.collectedRecords).toStrictEqual(initialRecords);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });

  describe('when the relation uses different case than the DOI', () => {
    const initialRecords = new Map<string, CrossrefRecord>([
      ['10.21203/rs.3.rs-1828415/v2', {
        message: {
          DOI: '10.21203/rs.3.rs-1828415/v2',
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
              id: '10.21203/rs.3.rs-1828415/v1',
            }],
          },
        },
      }],
      ['10.21203/rs.3.rs-1828415/v1', {
        message: {
          DOI: '10.21203/rs.3.rs-1828415/v1',
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
              id: '10.21203/RS.3.rs-1828415/v2',
            }],
          },
        },
      }],
    ]);
    const result = enqueueAllRelatedDoisNotYetCollected({ collectedRecords: initialRecords, queue: [] });

    it('the collected records are unchanged', () => {
      expect(result.collectedRecords).toStrictEqual(initialRecords);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });
});
