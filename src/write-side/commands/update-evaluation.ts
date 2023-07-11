import * as t from 'io-ts';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

const evaluationTypeCodec = t.union([t.literal('review'), t.literal('author-response'), t.literal('curation-statement')]);

export const updateEvaluationCommandCodec = t.strict({
  evaluationLocator: evaluationLocatorCodec,
  evaluationType: evaluationTypeCodec,
});

export type UpdateEvaluationCommand = t.TypeOf<typeof updateEvaluationCommandCodec>;
