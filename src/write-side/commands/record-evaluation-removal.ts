import * as t from 'io-ts';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

export const recordEvaluationRemovalCommandCodec = t.strict({
  evaluationLocator: evaluationLocatorCodec,
});

export type RecordEvaluationRemovalCommand = t.TypeOf<typeof recordEvaluationRemovalCommandCodec>;
