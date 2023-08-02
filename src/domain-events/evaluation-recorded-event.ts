import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';
import { evaluationTypeCodec } from './types/evaluation-type';

const eventTypePropertyCodec = (currentValue: string, deprecatedValue: string) => {
  const currentPropertyCodec = t.literal('EvaluationPublicationRecorded');
  return new t.Type(
    'UpgradedType',
    currentPropertyCodec.is,
    (u, c) => currentPropertyCodec.validate(u, c),
    currentPropertyCodec.encode,
  );
};

export const evaluationRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: eventTypePropertyCodec('EvaluationPublicationRecorded', 'EvaluationRecorded'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: DoiFromString,
  publishedAt: tt.DateFromISOString,
  authors: t.readonlyArray(t.string),
  evaluationType: evaluationTypeCodec,
});
