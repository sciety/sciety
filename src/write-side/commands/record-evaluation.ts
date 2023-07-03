import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { evaluationLocatorCodec } from '../../types/evaluation-locator';

const requiredFields = t.type({
  groupId: GroupIdFromString,
  publishedAt: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: DoiFromString,
  authors: t.readonlyArray(t.string),
});

const optionalFields = t.partial({
  issuedAt: tt.DateFromISOString,
  evaluationType: t.union([t.literal('review'), t.literal('author-response'), t.literal('curation-statement')]),
});

export const recordEvaluationCommandCodec = t.intersection([requiredFields, optionalFields]);

export type RecordEvaluationCommand = t.TypeOf<typeof recordEvaluationCommandCodec>;
