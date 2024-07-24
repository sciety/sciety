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
    ['prelights:https://prelights.biologists.com/?post_type=highlight&p=16176', 'prelights'],
    ['ncrc:0c88338d-a401-40f9-8bf8-ef0a43be4548', 'ncrc'],
    ['rapidreviews:http://dx.doi.org/10.1162/2e3983f5.b818fbae', 'rapid-reviews'],
    // ['doi:10.1099/acmi.0.000530.v1.3', 'access-microbiology'],
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
