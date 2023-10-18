import * as t from 'io-ts';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';
import { evaluationTypeCodec } from './types/evaluation-type';
import { evaluationAuthorsCodec } from './types/evaluation-authors';

export const updateEvaluationCommandCodec = t.intersection([
  t.strict({
    evaluationLocator: evaluationLocatorCodec,
  }),
  t.partial({
    evaluationType: evaluationTypeCodec,
    authors: evaluationAuthorsCodec,
  }),
]);

export type UpdateEvaluationCommand = t.TypeOf<typeof updateEvaluationCommandCodec>;
