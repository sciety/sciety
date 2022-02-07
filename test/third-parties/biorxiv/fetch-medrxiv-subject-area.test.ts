import * as E from 'fp-ts/Either';
import { fetchMedrxivSubjectArea } from '../../../src/third-parties/biorxiv/fetch-medrxiv-subject-area';
import * as DE from '../../../src/types/data-error';
import { arbitraryDoi } from '../../types/doi.helper';

describe('fetch-medrxiv-subject-area', () => {
  describe('when one article version is returned', () => {
    it.todo('returns the subject area');
  });

  describe('when there are multiple article versions', () => {
    it.todo('returns the subject area of the most recent version');
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
