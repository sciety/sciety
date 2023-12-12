import { enqueueAllRelatedDoisNotYetCollected } from '../../../src/third-parties/crossref/fetch-all-paper-expressions-from-crossref';
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
    const initialRecords = new Map([
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
    const initialRecords = new Map([
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

  describe('bug', () => {
    const initialRecords = new Map([
      [
        '10.21203/rs.3.rs-1828415/v2',
        {
          message: {
            posted: {
              'date-parts': [
                [
                  2023,
                  4,
                  17,
                ],
              ],
            },
            DOI: '10.21203/rs.3.rs-1828415/v2',
            resource: {
              primary: {
                URL: 'https://www.researchsquare.com/article/rs-1828415/v2',
              },
            },
            relation: {
              'is-version-of': [
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v1',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v3',
                },
              ],
              'has-version': [
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v1',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v3',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.1',
                },
              ],
            },
          },
        },
      ],
      [
        '10.21203/rs.3.rs-1828415/v1',
        {
          message: {
            posted: {
              'date-parts': [
                [
                  2022,
                  8,
                  1,
                ],
              ],
            },
            DOI: '10.21203/rs.3.rs-1828415/v1',
            resource: {
              primary: {
                URL: 'https://www.researchsquare.com/article/rs-1828415/v1',
              },
            },
            relation: {
              'is-version-of': [
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v2',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v3',
                },
              ],
              'has-version': [
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v2',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v3',
                },
              ],
            },
          },
        },
      ],
      [
        '10.21203/rs.3.rs-1828415/v3',
        {
          message: {
            posted: {
              'date-parts': [
                [
                  2023,
                  10,
                  11,
                ],
              ],
            },
            DOI: '10.21203/rs.3.rs-1828415/v3',
            resource: {
              primary: {
                URL: 'https://www.researchsquare.com/article/rs-1828415/v3',
              },
            },
            relation: {
              'is-version-of': [
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v1',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v2',
                },
              ],
              'has-version': [
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.2',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v1',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v2',
                },
              ],
            },
          },
        },
      ],
      [
        '10.7554/elife.87198.1',
        {
          message: {
            posted: {
              'date-parts': [
                [
                  2023,
                  6,
                  20,
                ],
              ],
            },
            DOI: '10.7554/elife.87198.1',
            resource: {
              primary: {
                URL: 'https://elifesciences.org/reviewed-preprints/87198v1',
              },
            },
            relation: {
              'is-version-of': [
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v2',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.2',
                },
              ],
              'has-review': [
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.1.sa2',
                  'asserted-by': 'object',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.1.sa1',
                  'asserted-by': 'object',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.1.sa0',
                  'asserted-by': 'object',
                },
              ],
            },
          },
        },
      ],
      [
        '10.7554/elife.87198.2',
        {
          message: {
            posted: {
              'date-parts': [
                [
                  2023,
                  12,
                  7,
                ],
              ],
            },
            DOI: '10.7554/elife.87198.2',
            resource: {
              primary: {
                URL: 'https://elifesciences.org/reviewed-preprints/87198v2',
              },
            },
            relation: {
              'has-version': [
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.1',
                },
              ],
              'is-version-of': [
                {
                  'id-type': 'doi' as const,
                  id: '10.21203/rs.3.rs-1828415/v3',
                },
              ],
              'has-review': [
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.2.sa0',
                  'asserted-by': 'object',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.2.sa1',
                  'asserted-by': 'object',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.2.sa2',
                  'asserted-by': 'object',
                },
                {
                  'id-type': 'doi' as const,
                  id: '10.7554/eLife.87198.2.sa3',
                  'asserted-by': 'object',
                },
              ],
            },
          },
        },
      ],
    ]);
    const result = enqueueAllRelatedDoisNotYetCollected({ collectedRecords: initialRecords, queue: [] });

    it('the collected records are unchanged', () => {
      expect(result.collectedRecords).toStrictEqual(initialRecords);
    });

    it.failing('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });
});
