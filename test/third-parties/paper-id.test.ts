import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { NonEmptyString } from 'io-ts-types';
import { v4 } from 'uuid';
import * as O from 'fp-ts/Option';
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

  describe('given a doi', () => {
    const input = arbitraryArticleId().value as NonEmptyString;

    describe('when decoded, followed by getDoiPortion', () => {
      const result = pipe(
        input,
        PaperId.paperIdCodec.decode,
        E.getOrElseW(shouldNotBeCalled),
        O.fromPredicate(PaperId.isDoi),
        O.getOrElseW(shouldNotBeCalled),
        PaperId.getDoiPortion,
      );

      it('results in the original value', () => {
        expect(result).toBe(input);
      });
    });

    describe('fromNonEmptyString', () => {
      const paperId = PaperId.fromNonEmptyString(input);

      it('detects that the paper id is a doi', () => {
        expect(PaperId.isDoi(paperId)).toBe(true);
      });

      it('detects that the paper id is not a uuid', () => {
        expect(PaperId.isUuid(paperId)).toBe(false);
      });
    });
  });

  describe('given neither a uuid nor a doi', () => {
    describe('fromNonEmptyString', () => {
      it.todo('returns on the left');
    });
  });
});
