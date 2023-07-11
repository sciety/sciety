import * as t from 'io-ts';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

const requiredFields = t.strict({
  evaluationLocator: evaluationLocatorCodec,
});

const evaluationTypeCodec = t.union([t.literal('review'), t.literal('author-response'), t.literal('curation-statement')]);

const optionalFields = t.partial({
  evaluationType: evaluationTypeCodec,
});

const updateEvaluationCommandCodec = t.intersection([requiredFields, optionalFields]);

export type UpdateEvaluationCommand = t.TypeOf<typeof updateEvaluationCommandCodec>;
