import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../../types/article-id.js';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString.js';
import { evaluationLocatorCodec } from '../../types/evaluation-locator.js';
import { evaluationTypeCodec } from './types/evaluation-type.js';
import { evaluationAuthorsCodec } from './types/evaluation-authors.js';

const requiredFields = t.strict({
  groupId: GroupIdFromString,
  publishedAt: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: articleIdCodec,
  authors: evaluationAuthorsCodec,
});

const optionalFields = t.partial({
  issuedAt: tt.DateFromISOString,
  evaluationType: evaluationTypeCodec,
});

export const recordEvaluationPublicationCommandCodec = t.intersection([requiredFields, optionalFields]);

export type RecordEvaluationPublicationCommand = t.TypeOf<typeof recordEvaluationPublicationCommandCodec>;
