import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { erase, update } from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { DomainEvent } from '../../../../src/domain-events';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('lifecycle', () => {
  describe('record -> erase -> update', () => {
    let result: unknown;
    const evaluationLocator = arbitraryEvaluationLocator();

    beforeEach(() => {
      const events: Array<DomainEvent> = [];
      const eventsFromErase = pipe(
        events,
        erase({
          evaluationLocator,
        }),
        E.getOrElseW(shouldNotBeCalled),
      );
      events.push(...eventsFromErase);
      result = update({
        evaluationLocator,
        evaluationType: arbitraryEvaluationType(),
      })(events);
    });

    it('errors with not found', () => {
      expect(result).toStrictEqual(E.left('Evaluation to be updated does not exist'));
    });
  });
});
