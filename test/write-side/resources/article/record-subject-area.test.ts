import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events';
import { ArticleId } from '../../../../src/types/article-id';
import { recordSubjectArea } from '../../../../src/write-side/resources/article';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../../domain-events/evaluation-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitrarySubjectArea } from '../../../types/subject-area.helper';

describe('execute-command', () => {
  const expressionDoi = arbitraryExpressionDoi();
  const subjectArea = arbitrarySubjectArea();
  const command = {
    articleId: new ArticleId(expressionDoi),
    subjectArea,
  };

  describe('given no events for the given article id', () => {
    const eventsRaised = pipe(
      [constructEvent('SubjectAreaRecorded')({ articleId: new ArticleId(arbitraryExpressionDoi()), subjectArea: arbitrarySubjectArea() })],
      recordSubjectArea(command),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises a single event', () => {
      expect(eventsRaised).toHaveLength(1);
      expect(eventsRaised[0]).toBeDomainEvent('SubjectAreaRecorded', {
        articleId: new ArticleId(expressionDoi),
        subjectArea,
      });
    });
  });

  describe('when an evaluation was recorded', () => {
    const eventsRaised = pipe(
      [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          articleId: expressionDoi,
        },
      ],
      recordSubjectArea(command),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises a single event', () => {
      expect(eventsRaised).toHaveLength(1);
      expect(eventsRaised[0]).toBeDomainEvent('SubjectAreaRecorded');
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
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
