import { pipe } from 'fp-ts/function';
import { RecordSubjectAreaCommand } from '../../src/commands';
import { DomainEvent } from '../../src/domain-events/domain-event';
import { subjectAreaRecorded } from '../../src/domain-events/subject-area-recorded-event';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitrarySubjectArea } from '../types/subject-area.helper';

type ExecuteCommand = (command: RecordSubjectAreaCommand)
=> (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<DomainEvent> ;

const executeCommand: ExecuteCommand = (command) => () => [
  subjectAreaRecorded(command.articleId, arbitrarySubjectArea()),
];

describe('record-subject-area-command-handler', () => {
  describe('given no events', () => {
    const articleId = arbitraryArticleId();
    const command = {
      articleId,
      subjectArea: arbitrarySubjectArea(),
    };

    const result = pipe(
      [],
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
  });

  describe('when an evaluation was recorded', () => {
    it.todo('raises an event');
  });

  describe('the same subject area was recorded', () => {
    it.todo('raises no events');
  });

  describe('a different subject area was recorded', () => {
    it.todo('returns an error message');
  });
});
