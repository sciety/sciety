import * as E from 'fp-ts/Either';
import { toEvaluation } from '../../src/ingest/fetch-reviews-from-hypothesis-group';
import { arbitraryDate, arbitraryWord } from '../helpers';

describe('fetch-reviews-from-hypothesis-group', () => {
  describe('when the url can be parsed to a doi', () => {
    const result = toEvaluation({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: 'https://www.medrxiv.org/content/10.1101/2021.06.18.21258689v1',
    });

    it('returns on the right', () => {
      expect(E.isRight(result)).toBe(true);
    });
  });

  describe('when the url can not be parsed to a doi', () => {
    const result = toEvaluation({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: 'http://example.com',
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
