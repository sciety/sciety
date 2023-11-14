import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/article-id';
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
  articleId: DoiFromString,
  publishedAt: tt.DateFromISOString,
  authors: evaluationAuthorsCodec,
  evaluationType: evaluationTypeCodec,
});

export const evaluationPublicationRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationPublicationRecorded'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: DoiFromString,
  publishedAt: tt.DateFromISOString,
  authors: evaluationAuthorsCodec,
  evaluationType: evaluationTypeCodec,
});
