import { constructCoarNotificationModel } from '../../../src/sagas/send-notification-to-coar-test-inbox/construct-coar-notification-model';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

describe('construct-coar-notification-model', () => {
  describe('given a pending evaluation', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const expressionDoi = arbitraryExpressionDoi();
    const coarNotification = constructCoarNotificationModel({
      evaluationLocator,
      expressionDoi,
    });

    describe('constructs an objectId', () => {
      it('that is specific to the evaluation locator', () => {
        expect(coarNotification.objectId.hash).toContain(evaluationLocator);
      });

      it.todo('that contains the expression DOI');

      it.todo('that is a URL on https://sciety.org');
    });
  });
});
