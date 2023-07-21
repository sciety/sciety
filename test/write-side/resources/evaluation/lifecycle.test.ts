import * as E from 'fp-ts/Either';
import { update } from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { DomainEvent } from '../../../../src/domain-events';

describe('lifecycle', () => {
  describe('record -> erase -> update', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const events: ReadonlyArray<DomainEvent> = [];
    const result = update({
      evaluationLocator,
      evaluationType: arbitraryEvaluationType(),
    })(events);

    it('errors with not found', () => {
      expect(result).toStrictEqual(E.left('Evaluation to be updated does not exist'));
    });
  });
});
