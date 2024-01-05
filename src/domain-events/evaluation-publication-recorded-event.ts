import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { expressionDoiCodec } from '../types/expression-doi';
import { articleIdCodec } from '../types/article-id';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';
import { evaluationTypeCodec } from './types/evaluation-type';
import { evaluationAuthorsCodec } from './types/evaluation-authors';

export const evaluationRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationRecorded'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: articleIdCodec,
  publishedAt: tt.DateFromISOString,
  authors: evaluationAuthorsCodec,
  evaluationType: evaluationTypeCodec,
});

export const evaluationPublicationRecordedEventV1Codec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationPublicationRecorded'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: articleIdCodec,
  publishedAt: tt.DateFromISOString,
  authors: evaluationAuthorsCodec,
  evaluationType: evaluationTypeCodec,
});

export const evaluationPublicationRecordedEventV2Codec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationPublicationRecorded'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: articleIdCodec,
  expressionDoi: expressionDoiCodec,
  publishedAt: tt.DateFromISOString,
  authors: evaluationAuthorsCodec,
  evaluationType: evaluationTypeCodec,
});
