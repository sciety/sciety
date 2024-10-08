import { URL } from 'url';
import { constructCoarNotificationModel } from '../../../src/sagas/ensure-delivery-of-notifications-to-coar-inboxes/construct-coar-notification-model';
import { arbitraryString, arbitraryUrl } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

describe('construct-coar-notification-model', () => {
  describe('given a pending evaluation', () => {
    const evaluationLocator = arbitraryEvaluationLocator();
    const expressionDoi = arbitraryExpressionDoi();
    const scietyUiOrigin = new URL('https://example.com');
    const coarNotification = constructCoarNotificationModel(scietyUiOrigin)({
      evaluationLocator,
      expressionDoi,
      target: {
        id: arbitraryString(),
        inbox: arbitraryUrl(),
      },
    });

    describe('constructs an objectId', () => {
      it('that is specific to the evaluation locator', () => {
        expect(coarNotification.objectId.hash).toContain(evaluationLocator);
      });

      it('that is specific to the expression DOI', () => {
        expect(coarNotification.objectId.pathname).toContain(expressionDoi);
      });

      it('that is a URL on the Sciety UI', () => {
        expect(coarNotification.objectId.host).toBe(scietyUiOrigin.host);
        expect(coarNotification.objectId.protocol).toBe(scietyUiOrigin.protocol);
      });
    });

    describe('constructs a contextId', () => {
      it('that is specific to the expression DOI', () => {
        expect(coarNotification.contextId.pathname).toContain(expressionDoi);
      });

      it('that is a URL on the Sciety UI', () => {
        expect(coarNotification.contextId.host).toBe(scietyUiOrigin.host);
        expect(coarNotification.contextId.protocol).toBe(scietyUiOrigin.protocol);
      });
    });

    describe('constructs contextCiteAs', () => {
      it('that is specific to the expression DOI', () => {
        expect(coarNotification.contextCiteAs.pathname).toContain(expressionDoi);
      });

      it('that is a URL on https://doi.org', () => {
        expect(coarNotification.contextCiteAs.host).toBe('doi.org');
        expect(coarNotification.contextCiteAs.protocol).toBe('https:');
      });
    });
  });
});
