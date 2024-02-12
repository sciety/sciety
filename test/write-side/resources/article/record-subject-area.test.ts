import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events';
import { recordSubjectArea } from '../../../../src/write-side/resources/article';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitrarySubjectArea } from '../../../types/subject-area.helper';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../../domain-events/evaluation-resource-events.helper';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { ArticleId } from '../../../../src/types/article-id';

describe('execute-command', () => {
  const expressionDoi = arbitraryExpressionDoi();
  const subjectArea = arbitrarySubjectArea();
  const command = {
    articleId: new ArticleId(expressionDoi),
    subjectArea,
  };

  describe('given no events for the given article id', () => {
    const result = pipe(
      [constructEvent('SubjectAreaRecorded')({ articleId: new ArticleId(arbitraryExpressionDoi()), subjectArea: arbitrarySubjectArea() })],
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
        { articleId: new ArticleId(expressionDoi) },
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
          articleId: expressionDoi,
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
        constructEvent('SubjectAreaRecorded')({ articleId: new ArticleId(expressionDoi), subjectArea }),
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
        constructEvent('SubjectAreaRecorded')({ articleId: new ArticleId(expressionDoi), subjectArea: arbitrarySubjectArea() }),
      ],
      recordSubjectArea(command),
    );

    it('returns an error message', () => {
      expect(result).toStrictEqual(E.left(expect.anything()));
    });
  });
});
