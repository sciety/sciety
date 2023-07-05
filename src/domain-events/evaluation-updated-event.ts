import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { evaluationLocatorCodec } from '../types/evaluation-locator';

export const evaluationUpdatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationUpdated'),
  date: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  evaluationType: t.union([
    t.union([t.literal('review'), t.literal('author-response'), t.literal('curation-statement')]),
    t.undefined,
  ]),
});
