import * as E from 'fp-ts/Either';
import { toEvaluation } from '../../src/ingest/fetch-reviews-from-hypothesis-group';
import { arbitraryDate, arbitraryWord } from '../helpers';

describe('fetch-reviews-from-hypothesis-group', () => {
  const supportedPreprintUri = 'https://www.medrxiv.org/content/10.1101/2021.06.18.21258689v1';

  describe('when the url can be parsed to a doi and the annotation contains text', () => {
    const result = toEvaluation({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: supportedPreprintUri,
      text: arbitraryWord(),
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
      text: arbitraryWord(),
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the evaluation relates to an highlight-only annotation', () => {
    const result = toEvaluation({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: supportedPreprintUri,
      text: '',
    });

    it('returns on the left', () => {
      expect(result).toStrictEqual(E.left(expect.objectContaining({
        reason: 'annotation text field is empty',
      })));
    });
  });
});
