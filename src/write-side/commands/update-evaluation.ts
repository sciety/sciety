import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { evaluationAuthorsCodec } from './types/evaluation-authors';
import { evaluationTypeCodec } from '../../domain-events/types/evaluation-type';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

export const updateEvaluationCommandCodec = t.intersection([
  t.strict({
    evaluationLocator: evaluationLocatorCodec,
  }),
  t.partial({
    evaluationType: evaluationTypeCodec,
    authors: evaluationAuthorsCodec,
    issuedAt: tt.DateFromISOString,
  }),
]);

export type UpdateEvaluationCommand = t.TypeOf<typeof updateEvaluationCommandCodec>;
