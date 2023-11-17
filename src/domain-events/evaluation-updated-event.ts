import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { evaluationLocatorCodec } from '../types/evaluation-locator.js';
import { evaluationTypeCodec } from './types/evaluation-type.js';
import { evaluationAuthorsCodec } from './types/evaluation-authors.js';

export const evaluationUpdatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationUpdated'),
  date: tt.DateFromISOString,
  evaluationLocator: evaluationLocatorCodec,
  evaluationType: t.union([evaluationTypeCodec, t.undefined]),
  authors: t.union([evaluationAuthorsCodec, t.undefined]),
});
