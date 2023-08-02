import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
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
    (u, c) => pipe(
      t.string.validate(u, c),
      E.chain((value) => {
        if (value === deprecatedValue) {
          return currentPropertyCodec.validate(currentValue, c);
        }
        if (value === currentValue) {
          return currentPropertyCodec.validate(currentValue, c);
        }
        return t.failure(u, c);
      }),
    ),
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
