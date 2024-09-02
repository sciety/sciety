import { constructEvent, EventOfType } from '../../src/domain-events';
import { arbitraryString } from '../helpers';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper';

export const arbitraryCoarNotificationDeliveredEvent = (): EventOfType<'CoarNotificationDelivered'> => constructEvent('CoarNotificationDelivered')({
  evaluationLocator: arbitraryEvaluationLocator(),
  targetId: arbitraryString(),
});
