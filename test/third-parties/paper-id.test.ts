import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { NonEmptyString } from 'io-ts-types';
import { v4 } from 'uuid';
import { PaperId } from '../../src/third-parties';
import { arbitraryArticleId } from '../types/article-id.helper';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('paper-id', () => {
  describe('given a uuid', () => {
    const input = v4() as NonEmptyString;

    describe('fromNonEmptyString', () => {
      const paperId = PaperId.fromNonEmptyString(input);

      it('detects that the paper id is not a doi', () => {
        expect(PaperId.isDoi(paperId)).toBe(false);
      });

      it('detects that the paper id is a uuid', () => {
        expect(PaperId.isUuid(paperId)).toBe(true);
      });
    });
  });

  describe('when successfully decoding a DOI', () => {
    const input = arbitraryArticleId().value as NonEmptyString;
    const decoded = pipe(
      input,
      PaperId.paperIdCodec.decode,
      E.getOrElseW(shouldNotBeCalled),
    );

    it('isDoi detects that the paper id is a doi', () => {
      expect(PaperId.isDoi(decoded)).toBe(true);
    });

    it('isUuid detects that the paper id is not a uuid', () => {
      expect(PaperId.isUuid(decoded)).toBe(false);
    });

    describe('getDoiPortion', () => {
      const result = pipe(
        decoded,
        O.fromPredicate(PaperId.isDoi),
        O.getOrElseW(shouldNotBeCalled),
        PaperId.getDoiPortion,
      );

      it('results in the original value', () => {
        expect(result).toBe(input);
      });
    });
  });

  describe('given neither a uuid nor a doi', () => {
    describe('fromNonEmptyString', () => {
      it.todo('returns on the left');
    });
  });
});
