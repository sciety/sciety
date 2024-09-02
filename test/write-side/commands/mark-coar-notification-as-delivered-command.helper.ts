import { MarkCoarNotificationAsDeliveredCommand } from '../../../src/write-side/commands';
import { arbitraryString } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';

export const arbitraryMarkCoarNotificationAsDeliveredCommand = (): MarkCoarNotificationAsDeliveredCommand => ({
  evaluationLocator: arbitraryEvaluationLocator(),
  targetId: arbitraryString(),
});
