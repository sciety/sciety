import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded, subjectAreaRecorded } from '../../../src/domain-events';
import { executeCommand } from '../../../src/write-side/record-subject-area/execute-command';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitrarySubjectArea } from '../../types/subject-area.helper';
import { arbitraryDate } from '../../helpers';

describe('execute-command', () => {
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
      E.getOrElseW(shouldNotBeCalled),
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
        evaluationRecorded(arbitraryGroupId(), articleId, arbitraryEvaluationLocator(), [], arbitraryDate()),
      ],
      executeCommand(command),
      E.getOrElseW(shouldNotBeCalled),
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
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises no events', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('a different subject area was recorded for the article', () => {
    const result = pipe(
      [
        subjectAreaRecorded(articleId, arbitrarySubjectArea()),
      ],
      executeCommand(command),
    );

    it('returns an error message', () => {
      expect(result).toStrictEqual(E.left(expect.anything()));
    });
  });
});
