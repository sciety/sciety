import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events/index.js';
import { recordSubjectArea } from '../../../../src/write-side/resources/article/index.js';
import { shouldNotBeCalled } from '../../../should-not-be-called.js';
import { arbitraryArticleId } from '../../../types/article-id.helper.js';
import { arbitrarySubjectArea } from '../../../types/subject-area.helper.js';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../../domain-events/evaluation-resource-events.helper.js';

describe('execute-command', () => {
  const articleId = arbitraryArticleId();
  const subjectArea = arbitrarySubjectArea();
  const command = {
    articleId,
    subjectArea,
  };

  describe('given no events for the given article id', () => {
    const result = pipe(
      [constructEvent('SubjectAreaRecorded')({ articleId: arbitraryArticleId(), subjectArea: arbitrarySubjectArea() })],
      recordSubjectArea(command),
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
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          articleId,
        },
      ],
      recordSubjectArea(command),
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
        constructEvent('SubjectAreaRecorded')({ articleId, subjectArea }),
      ],
      recordSubjectArea(command),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises no events', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('a different subject area was recorded for the article', () => {
    const result = pipe(
      [
        constructEvent('SubjectAreaRecorded')({ articleId, subjectArea: arbitrarySubjectArea() }),
      ],
      recordSubjectArea(command),
    );

    it('returns an error message', () => {
      expect(result).toStrictEqual(E.left(expect.anything()));
    });
  });
});
