import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';
import { evaluationTypeCodec } from './types/evaluation-type';

const upgradedEventType = <T extends string>(currentValue: T, deprecatedValues: ReadonlyArray<string>) => {
  const currentEventTypeCodec = t.literal(currentValue);
  return new t.Type(
    'UpgradedType',
    currentEventTypeCodec.is,
    (u, c) => pipe(
      t.string.validate(u, c),
      E.chain((value) => {
        if (deprecatedValues.includes(value)) {
          return currentEventTypeCodec.validate(currentValue, c);
        }
        if (value === currentValue) {
          return currentEventTypeCodec.validate(currentValue, c);
        }
        return t.failure(u, c);
      }),
    ),
    currentEventTypeCodec.encode,
  );
};

export const evaluationPublicationRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: upgradedEventType('EvaluationPublicationRecorded', ['EvaluationRecorded']),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: DoiFromString,
  publishedAt: tt.DateFromISOString,
  authors: t.readonlyArray(t.string),
  evaluationType: evaluationTypeCodec,
});
