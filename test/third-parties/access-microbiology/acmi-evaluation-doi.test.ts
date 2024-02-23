import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { abortTest } from '../../framework/abort-test';
import {
  acmiEvaluationDoiCodec,
} from '../../../src/third-parties/access-microbiology/acmi-evaluation-doi';

describe('acmi-evaluation-doi', () => {
  describe('acmiEvaluationDoiCodec', () => {
    describe('when decoding a value that represents a valid ACMI evaluation DOI', () => {
      const input = '10.1099/acmi.0.000569.v1.5';
      let result: string;

      beforeEach(() => {
        result = pipe(
          input,
          acmiEvaluationDoiCodec.decode,
          E.getOrElseW(abortTest('Codec returned on the left')),
        );
      });

      it('returns the DOI', () => {
        expect(result).toBe(input);
      });
    });

    describe('when attempting to decode a value that does not represent a valid ACMI evaluation DOI', () => {
      it.todo('returns on the left');
    });
  });
});
