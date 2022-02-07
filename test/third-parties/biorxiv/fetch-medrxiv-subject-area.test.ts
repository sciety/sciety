import * as E from 'fp-ts/Either';
import { fetchMedrxivSubjectArea } from '../../../src/third-parties/biorxiv/fetch-medrxiv-subject-area';
import * as DE from '../../../src/types/data-error';
import { arbitraryDoi } from '../../types/doi.helper';

describe('fetch-medrxiv-subject-area', () => {
  describe('when one article version is returned', () => {
    const ports = {
      getJson: async () => ({ collection: [{ category: 'addiction medicine' }] }),
    };
    let result: E.Either<DE.DataError, string>;

    beforeEach(async () => {
      result = await fetchMedrxivSubjectArea(ports)(arbitraryDoi())();
    });

    it.skip('returns the subject area', () => {
      expect(result).toStrictEqual(E.right('addiction medicine'));
    });
  });

  describe('when there are multiple article versions', () => {
    const ports = {
      getJson: async () => ({
        collection: [
          { category: 'addiction medicine', version: '2' },
          { category: 'allergy and immunology', version: '1' },
        ],
      }),
    };
    let result: E.Either<DE.DataError, string>;

    beforeEach(async () => {
      result = await fetchMedrxivSubjectArea(ports)(arbitraryDoi())();
    });

    it.skip('returns the subject area of the most recent version', () => {
      expect(result).toStrictEqual(E.right('addiction medicine'));
    });
  });

  describe('when no article versions are returned', () => {
    const ports = {
      getJson: async () => ({}),
    };
    let result: E.Either<DE.DataError, string>;

    beforeEach(async () => {
      result = await fetchMedrxivSubjectArea(ports)(arbitraryDoi())();
    });

    it('returns a left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
