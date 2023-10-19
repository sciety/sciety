import * as t from 'io-ts';
import * as tt from 'io-ts-types';
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
    issuedAt: tt.DateFromISOString,
  }),
]);

export type UpdateEvaluationCommand = t.TypeOf<typeof updateEvaluationCommandCodec>;
