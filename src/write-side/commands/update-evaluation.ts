import * as t from 'io-ts';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';
import { evaluationTypeCodec } from './record-evaluation-publication';

export const updateEvaluationCommandCodec = t.intersection([
  t.strict({
    evaluationLocator: evaluationLocatorCodec,
  }),
  t.partial({
    evaluationType: evaluationTypeCodec,
  }),
]);

export type UpdateEvaluationCommand = t.TypeOf<typeof updateEvaluationCommandCodec>;
