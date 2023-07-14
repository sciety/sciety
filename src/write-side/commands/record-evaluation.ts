import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

const requiredFields = t.strict({
  groupId: GroupIdFromString,
  publishedAt: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: DoiFromString,
  authors: t.readonlyArray(t.string),
});

const evaluationTypeCodec = t.union([
  t.literal('review'),
  t.literal('author-response'),
  t.literal('curation-statement'),
  t.literal('not-provided'),
]);

const optionalFields = t.partial({
  issuedAt: tt.DateFromISOString,
  evaluationType: evaluationTypeCodec,
});

export const recordEvaluationCommandCodec = t.intersection([requiredFields, optionalFields]);

export type RecordEvaluationCommand = t.TypeOf<typeof recordEvaluationCommandCodec>;
