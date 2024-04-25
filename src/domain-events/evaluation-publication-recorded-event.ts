import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { evaluationAuthorsCodec } from './types/evaluation-authors';
import { evaluationTypeCodec } from './types/evaluation-type';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';
import { canonicalExpressionDoiCodec } from '../types/expression-doi';
import { GroupIdFromStringCodec } from '../types/group-id';

const commonFields = {
  id: EventIdFromString,
  date: tt.DateFromISOString,
  groupId: GroupIdFromStringCodec,
  evaluationLocator: evaluationLocatorCodec,
  articleId: canonicalExpressionDoiCodec,
  publishedAt: tt.DateFromISOString,
  authors: evaluationAuthorsCodec,
  evaluationType: evaluationTypeCodec,
};

export const evaluationRecordedEventCodec = t.type({
  type: t.literal('EvaluationRecorded'),
  ...commonFields,
});

export const evaluationPublicationRecordedEventCodec = t.type({
  type: t.literal('EvaluationPublicationRecorded'),
  ...commonFields,
});
