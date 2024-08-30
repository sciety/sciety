import * as t from 'io-ts';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

const recordCoarNotificationDeliveryCommandCodec = t.strict({
  evaluationLocator: evaluationLocatorCodec,
  targetId: t.string,
});

export type RecordCoarNotificationDeliveryCommand = t.TypeOf<typeof recordCoarNotificationDeliveryCommandCodec>;
