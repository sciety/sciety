import * as t from 'io-ts';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

const markCoarNotificationAsDeliveredCommandCodec = t.strict({
  evaluationLocator: evaluationLocatorCodec,
  targetId: t.string,
});

export type MarkCoarNotificationAsDeliveredCommand = t.TypeOf<typeof markCoarNotificationAsDeliveredCommandCodec>;
