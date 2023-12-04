import { pipe } from 'fp-ts/function';
import { NonEmptyString } from 'io-ts-types';
import { PaperId } from '../../src/third-parties';
import { arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';

describe('paper-id', () => {
  describe('when a construction is followed by a destruction', () => {
    const original = arbitraryString() as NonEmptyString;
    const result = pipe(
      original,
      PaperId.fromNonEmptyString,
      PaperId.getDoiPortion,
    );

    it('results in the original value', () => {
      expect(result).toBe(original);
    });
  });

  describe('given a uuid', () => {
    describe('fromNonEmptyString', () => {
      it.todo('constructs the paper id correctly');
    });
  });

  describe('given an ambiguous, backwards-compatible input', () => {
    describe('fromNonEmptyString', () => {
      it('constructs the paper id correctly', () => {
        const input = arbitraryArticleId().value as NonEmptyString;
        const paperId = PaperId.fromNonEmptyString(input);

        expect(PaperId.isDoi(paperId)).toBe(true);
      });
    });
  });
});
