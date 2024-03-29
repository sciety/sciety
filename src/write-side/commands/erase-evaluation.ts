import * as t from 'io-ts';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

export const eraseEvaluationCommandCodec = t.strict({
  evaluationLocator: evaluationLocatorCodec,
});

export type EraseEvaluationCommand = t.TypeOf<typeof eraseEvaluationCommandCodec>;
