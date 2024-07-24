import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  DigestHostAndKey,
  getEvaluationMachineReadableDigestHostAndKey,
} from '../../../src/third-parties/fetch-evaluation-digest/get-evaluation-machine-readable-digest-host-and-key';
import { toEvaluationLocator } from '../../../src/types/evaluation-locator';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('get-evaluation-machine-readable-digest-host-and-key', () => {
  describe.each([
    ['hypothesis:123', 'hypothesis'],
    ['doi:10.5281/zenodo.3678326', 'zenodo'],
  ])('given an evaluation locator such as %s', (evaluationLocator, host) => {
    let result: DigestHostAndKey;

    beforeEach(() => {
      result = pipe(
        toEvaluationLocator(evaluationLocator),
        getEvaluationMachineReadableDigestHostAndKey,
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it.failing(`returns ${host} as a host`, () => {
      expect(result.host).toBe(host);
    });
  });
});
