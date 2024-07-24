import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  DigestHostAndKey,
  getEvaluationMachineReadableDigestHostAndKey,
} from '../../../src/third-parties/fetch-evaluation-digest/get-evaluation-machine-readable-digest-host-and-key';
import { toEvaluationLocator } from '../../../src/types/evaluation-locator';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('get-evaluation-machine-readable-digest-host-and-key', () => {
  describe('when the service is hypothesis', () => {
    let result: DigestHostAndKey;

    beforeEach(() => {
      result = pipe(
        toEvaluationLocator('hypothesis:123'),
        getEvaluationMachineReadableDigestHostAndKey,
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it.failing('returns hypothesis as a host', () => {
      expect(result.host).toBe('hypothesis');
    });
  });
});
