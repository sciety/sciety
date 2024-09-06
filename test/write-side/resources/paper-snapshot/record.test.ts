import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import { RecordPaperSnapshotCommand } from '../../../../src/write-side/commands';
import { record } from '../../../../src/write-side/resources/paper-snapshot/record';
import { arbitraryPaperSnapshotRecordedEvent } from '../../../domain-events/arbitrary-paper-snapshot-event.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryRecordPaperSnapshotCommand } from '../../commands/record-paper-snapshot-command.helper';

describe('record', () => {
  describe('when there are no paper snapshots', () => {
    const events: ReadonlyArray<DomainEvent> = [];

    describe('when no expression dois are provided in the command', () => {
      const command: RecordPaperSnapshotCommand = {
        expressionDois: new Set(),
      };
      let result: E.Either<unknown, unknown>;

      beforeEach(() => {
        result = pipe(
          events,
          record(command),
        );
      });

      it('rejects the command', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('when a set of expression dois is provided in the command', () => {
      const command = arbitraryRecordPaperSnapshotCommand();
      let result: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = pipe(
          events,
          record(command),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it('causes a state change in which a paper snapshot is recorded', () => {
        expect(result).toHaveLength(1);
        expect(result[0]).toBeDomainEvent('PaperSnapshotRecorded', {
          expressionDois: command.expressionDois,
        });
      });
    });
  });

  describe('when there is a paper snapshot', () => {
    const previousPaperSnapshotRecordedEvent = arbitraryPaperSnapshotRecordedEvent();
    const events = [
      previousPaperSnapshotRecordedEvent,
    ];

    describe('when the same set of expression dois is provided in the command', () => {
      const command: RecordPaperSnapshotCommand = {
        expressionDois: previousPaperSnapshotRecordedEvent.expressionDois,
      };
      let result: ReadonlyArray<DomainEvent>;

      beforeEach(() => {
        result = pipe(
          events,
          record(command),
          E.getOrElseW(shouldNotBeCalled),
        );
      });

      it.failing('accepts the command and causes no state change', () => {
        expect(result).toHaveLength(0);
      });
    });
  });
});
