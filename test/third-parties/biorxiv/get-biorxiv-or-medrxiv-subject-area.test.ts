import * as E from 'fp-ts/Either';
import { getBiorxivOrMedrxivSubjectArea } from '../../../src/third-parties/biorxiv/get-biorxiv-or-medrxiv-subject-area';
import * as DE from '../../../src/types/data-error';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';

describe('get-biorxiv-or-medrxiv-subject-area', () => {
  describe('when one article version is returned', () => {
    const ports = {
      getJson: async () => ({
        collection: [{
          category: 'addiction medicine',
          version: '1',
          date: arbitraryDate().toISOString(),
        }],
      }),
      logger: dummyLogger,
    };
    let result: E.Either<DE.DataError, string>;

    beforeEach(async () => {
      result = await getBiorxivOrMedrxivSubjectArea(ports)(arbitraryDoi())();
    });

    it('returns the subject area', () => {
      expect(result).toStrictEqual(E.right('addiction medicine'));
    });
  });

  describe('when there are multiple article versions', () => {
    const ports = {
      getJson: async () => ({
        collection: [
          {
            category: 'allergy and immunology',
            version: '1',
            date: arbitraryDate().toISOString(),
          },
          {
            category: 'addiction medicine',
            version: '2',
            date: arbitraryDate().toISOString(),
          },
        ],
      }),
      logger: dummyLogger,
    };
    let result: E.Either<DE.DataError, string>;

    beforeEach(async () => {
      result = await getBiorxivOrMedrxivSubjectArea(ports)(arbitraryDoi())();
    });

    it('returns the subject area of the most recent version', () => {
      expect(result).toStrictEqual(E.right('addiction medicine'));
    });
  });

  describe('when no article versions are returned', () => {
    const ports = {
      getJson: async () => ({}),
      logger: dummyLogger,
    };
    let result: E.Either<DE.DataError, string>;

    beforeEach(async () => {
      result = await getBiorxivOrMedrxivSubjectArea(ports)(arbitraryDoi())();
    });

    it('returns a left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
