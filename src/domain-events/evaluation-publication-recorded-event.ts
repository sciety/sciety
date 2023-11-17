import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id.js';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString.js';
import { evaluationLocatorCodec } from '../types/evaluation-locator.js';
import { evaluationTypeCodec } from './types/evaluation-type.js';
import { evaluationAuthorsCodec } from './types/evaluation-authors.js';

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

export const evaluationPublicationRecordedEventCodec = t.type({
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
