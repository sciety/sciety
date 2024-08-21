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

      it('that is specific to the expression DOI', () => {
        expect(coarNotification.objectId.pathname).toContain(expressionDoi);
      });

      it('that is a URL on https://sciety.org', () => {
        expect(coarNotification.objectId.host).toBe('sciety.org');
      });
    });

    describe('constructs a contextId', () => {
      it('that is specific to the expression DOI', () => {
        expect(coarNotification.contextId.pathname).toContain(expressionDoi);
      });

      it('that is a URL on https://sciety.org', () => {
        expect(coarNotification.contextId.host).toBe('sciety.org');
      });
    });
  });
});
