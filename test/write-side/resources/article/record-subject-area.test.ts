import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent, EventOfType } from '../../../../src/domain-events';
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
    const eventsRaised = pipe(
      [constructEvent('SubjectAreaRecorded')({ articleId: new ArticleId(arbitraryExpressionDoi()), subjectArea: arbitrarySubjectArea() })],
      recordSubjectArea(command),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('raises a single event', () => {
      expect(eventsRaised).toHaveLength(1);
    });

    describe('the event raised', () => {
      const event = eventsRaised[0] as EventOfType<'SubjectAreaRecorded'>;

      it('includes the article id from the command', () => {
        expect(event.articleId).toStrictEqual(new ArticleId(expressionDoi));
      });

      it('includes the subject area from the command', () => {
        expect(event.subjectArea).toStrictEqual(subjectArea);
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
    });

    it('raises an event of the correct type', () => {
      expect(eventsRaised[0].type).toBe('SubjectAreaRecorded');
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
