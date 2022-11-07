import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { RecordSubjectAreaCommand } from '../../src/commands';
import { DomainEvent } from '../../src/domain-events/domain-event';
import { evaluationRecorded } from '../../src/domain-events/evaluation-recorded-event';
import { isSubjectAreaRecordedEvent, subjectAreaRecorded } from '../../src/domain-events/subject-area-recorded-event';
import { eqDoi } from '../../src/types/doi';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitrarySubjectArea } from '../types/subject-area.helper';

type ExecuteCommand = (command: RecordSubjectAreaCommand)
=> (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<DomainEvent> ;

const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  events,
  RA.filter(isSubjectAreaRecordedEvent),
  RA.filter((event) => eqDoi.equals(event.articleId, command.articleId)),
  RA.match(
    () => [
      subjectAreaRecorded(command.articleId, command.subjectArea),
    ],
    () => [],
  ),
);

describe('record-subject-area-command-handler', () => {
  const articleId = arbitraryArticleId();
  const subjectArea = arbitrarySubjectArea();
  const command = {
    articleId,
    subjectArea,
  };

  describe('given no events for the given article id', () => {
    const result = pipe(
      [subjectAreaRecorded(arbitraryArticleId(), arbitrarySubjectArea())],
      executeCommand(command),
    );

    it('raises an event', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        { type: 'SubjectAreaRecorded' },
      )]);
    });

    it('raises an event, containing the article id from the command', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        { articleId },
      )]);
    });

    it('raises an event, containing the subject area from the command', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        { subjectArea },
      )]);
    });
  });

  describe('when an evaluation was recorded', () => {
    const result = pipe(
      [
        evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
      ],
      executeCommand(command),
    );

    it('raises an event', () => {
      expect(result).toStrictEqual([expect.objectContaining(
        { type: 'SubjectAreaRecorded' },
      )]);
    });
  });

  describe('the same subject area was recorded', () => {
    const result = pipe(
      [
        subjectAreaRecorded(articleId, subjectArea),
      ],
      executeCommand(command),
    );

    it('raises no events', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('a different subject area was recorded', () => {
    it.todo('returns an error message');
  });
});
