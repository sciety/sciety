import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString.js';
import { evaluationLocatorCodec } from '../types/evaluation-locator.js';
import { evaluationTypeCodec } from './types/evaluation-type.js';
import { evaluationAuthorsCodec } from './types/evaluation-authors.js';
import { canonicalExpressionDoiCodec } from '../types/expression-doi.js';

const commonFields = {
  id: EventIdFromString,
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
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
