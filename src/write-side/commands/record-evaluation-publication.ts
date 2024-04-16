import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { evaluationAuthorsCodec } from './types/evaluation-authors';
import { evaluationTypeCodec } from './types/evaluation-type';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';
import { expressionDoiCodec } from '../../types/expression-doi';

const requiredFields = t.strict({
  groupId: GroupIdFromString,
  publishedAt: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  expressionDoi: expressionDoiCodec,
  authors: evaluationAuthorsCodec,
});

const optionalFields = t.partial({
  issuedAt: tt.DateFromISOString,
  evaluationType: evaluationTypeCodec,
});

export const recordEvaluationPublicationCommandCodec = t.intersection([requiredFields, optionalFields]);

export type RecordEvaluationPublicationCommand = t.TypeOf<typeof recordEvaluationPublicationCommandCodec>;
