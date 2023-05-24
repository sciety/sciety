import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';
import { GroupId } from '../types/group-id';
import { EvaluationLocator, evaluationLocatorCodec } from '../types/evaluation-locator';

export const evaluationRecordedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluationRecorded'),
  date: tt.DateFromISOString,
  groupId: GroupIdFromString,
  evaluationLocator: evaluationLocatorCodec,
  articleId: DoiFromString,
  publishedAt: tt.DateFromISOString,
  authors: t.readonlyArray(t.string),
});

// ts-unused-exports:disable-next-line
export type EvaluationRecordedEvent = t.TypeOf<typeof evaluationRecordedEventCodec>;

// ts-unused-exports:disable-next-line
export const isEvaluationRecordedEvent = (event: { type: string }):
  event is EvaluationRecordedEvent => event.type === 'EvaluationRecorded';

// ts-unused-exports:disable-next-line
export const evaluationRecorded = (
  groupId: GroupId,
  doi: Doi,
  evaluationLocator: EvaluationLocator,
  authors: ReadonlyArray<string>,
  publishedAt: Date,
  date: Date = new Date(),
): EvaluationRecordedEvent => ({
  id: generate(),
  type: 'EvaluationRecorded',
  date,
  groupId,
  articleId: doi,
  evaluationLocator,
  publishedAt,
  authors,
});
