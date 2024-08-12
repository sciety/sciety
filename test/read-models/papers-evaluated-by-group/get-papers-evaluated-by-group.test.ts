/* eslint-disable @typescript-eslint/no-unused-vars */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EventOfType } from '../../../src/domain-events';
import { GroupId } from '../../../src/types/group-id';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

type ReadModel = unknown;

const initialState = () => ({});

const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;

const getPapersEvaluatedByGroup = (readModel: ReadModel) => (groupId: GroupId) => [];

const runQuery = (events: ReadonlyArray<DomainEvent>, groupId: GroupId) => {
  const readModel = pipe(
    events,
    RA.reduce(initialState(), handleEvent),
  );
  return getPapersEvaluatedByGroup(readModel)(groupId);
};

describe('get-papers-evaluated-by-group', () => {
  describe('tbd', () => {
    const groupId = arbitraryGroupId();
    const events = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
      } satisfies EventOfType<'EvaluationPublicationRecorded'>,
    ];
    const result = runQuery(events, groupId);

    it('tbd', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
