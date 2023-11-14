import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../../types/article-id';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';
import { evaluationTypeCodec } from './types/evaluation-type';
import { evaluationAuthorsCodec } from './types/evaluation-authors';

const requiredFields = t.strict({
  groupId: GroupIdFromString,
  publishedAt: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: DoiFromString,
  authors: evaluationAuthorsCodec,
});

const optionalFields = t.partial({
  issuedAt: tt.DateFromISOString,
  evaluationType: evaluationTypeCodec,
});

export const recordEvaluationPublicationCommandCodec = t.intersection([requiredFields, optionalFields]);

export type RecordEvaluationPublicationCommand = t.TypeOf<typeof recordEvaluationPublicationCommandCodec>;
