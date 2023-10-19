import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { arbitraryEvaluationUpdatedEvent } from '../../domain-events/evaluation-updated-event.helper';
import { getEvaluationsForArticle } from '../../../src/read-models/evaluations/get-evaluations-for-article';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-publication-recorded-event.helper';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { handleEvent, initialState } from '../../../src/read-models/evaluations/handle-event';
import { ArticleId } from '../../../src/types/article-id';
import { EvaluationLocator } from '../../../src/types/evaluation-locator';
import { EvaluationType } from '../../../src/types/recorded-evaluation';
import { arbitraryEvaluationRemovalRecordedEvent } from '../../domain-events/evaluation-removal-recorded-event-helper';
import { arbitraryString } from '../../helpers';

const runQuery = (articleId: ArticleId) => (events: ReadonlyArray<DomainEvent>) => {
  const readmodel = pipe(
    events,
    RA.reduce(initialState(), handleEvent),
  );
  return pipe(
    articleId,
    getEvaluationsForArticle(readmodel),
  );
};

const evaluationRecorded = (articleId: ArticleId, evaluationLocator: EvaluationLocator) => (
  {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    articleId,
    evaluationLocator,
  }
);

const evaluationRecordedWithType = (
  articleId: ArticleId,
  evaluationLocator: EvaluationLocator,
  evaluationType: EvaluationType,
) => ({
  ...arbitraryEvaluationPublicationRecordedEvent(),
  articleId,
  evaluationLocator,
  evaluationType,
});

describe('get-evaluations-for-article', () => {
  describe('when there is an arbitrary number of evaluations', () => {
    const article1 = arbitraryArticleId();
    const article2 = arbitraryArticleId();
    const evaluationLocator1 = arbitraryEvaluationLocator();
    const evaluationLocator2 = arbitraryEvaluationLocator();
    const evaluationLocator3 = arbitraryEvaluationLocator();

    it.each([
      ['two evaluations', article1, [evaluationLocator1, evaluationLocator3]],
      ['one evaluation', article2, [evaluationLocator2]],
      ['no evaluations', arbitraryArticleId(), []],
    ])('finds the correct evaluations when the article has %s', async (_, articleDoi, expectedEvaluations) => {
      const actualEvaluations = pipe(
        [
          evaluationRecorded(article1, evaluationLocator1),
          evaluationRecorded(article2, evaluationLocator2),
          evaluationRecorded(article1, evaluationLocator3),
        ],
        runQuery(articleDoi),
        RA.map((evaluation) => evaluation.evaluationLocator),
      );

      expect(actualEvaluations).toStrictEqual(expectedEvaluations);
    });
  });

  describe('when an evaluation has been recorded and then erased', () => {
    const articleId = arbitraryArticleId();
    const evaluationLocator = arbitraryEvaluationLocator();
    const actualEvaluations = pipe(
      [
        evaluationRecorded(articleId, evaluationLocator),
        constructEvent('IncorrectlyRecordedEvaluationErased')({ evaluationLocator }),
      ],
      runQuery(articleId),
      RA.map((evaluation) => evaluation.evaluationLocator),
    );

    it('does not return erased evaluations', () => {
      expect(actualEvaluations).toStrictEqual([]);
    });
  });

  describe('when an evaluation publication and its removal have been recorded', () => {
    const articleId = arbitraryArticleId();
    const evaluationLocator = arbitraryEvaluationLocator();
    const actualEvaluations = pipe(
      [
        evaluationRecorded(articleId, evaluationLocator),
        {
          ...arbitraryEvaluationRemovalRecordedEvent(),
          evaluationLocator,
        },
      ],
      runQuery(articleId),
      RA.map((evaluation) => evaluation.evaluationLocator),
    );

    it('does not return evaluations whose removal has been recorded', () => {
      expect(actualEvaluations).toStrictEqual([]);
    });
  });

  describe('when the evaluation was recorded without a type, and a curation statement was recorded later', () => {
    const articleId = arbitraryArticleId();
    const evaluationLocator = arbitraryEvaluationLocator();
    const groupId = arbitraryGroupId();
    const result = pipe(
      [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId,
          articleId,
          evaluationLocator,
        },
        constructEvent('CurationStatementRecorded')({ articleId, groupId, evaluationLocator }),
      ],
      runQuery(articleId),
    );

    it('contains the right type', () => {
      expect(result[0].type).toStrictEqual(O.some('curation-statement'));
    });
  });

  describe('when an evaluation is recorded', () => {
    const articleId = arbitraryArticleId();

    describe.each([
      ['curation-statement', O.some('curation-statement')],
      ['review', O.some('review')],
      ['author-response', O.some('author-response')],
      [undefined, O.none],
    ])('as %s', (inputType, expectedType) => {
      const result = pipe(
        [
          evaluationRecordedWithType(
            articleId,
            arbitraryEvaluationLocator(),
            inputType as unknown as EvaluationType,
          ),
        ],
        runQuery(articleId),
      );

      it('the type is returned correctly', () => {
        expect(result[0].type).toStrictEqual(expectedType);
      });

      it.failing('the updated date is the date of the recording', () => {
        expect(result[0].updatedAt).toStrictEqual(result[0].recordedAt);
      });
    });
  });

  describe('when the type of an evaluation is updated later', () => {
    const articleId = arbitraryArticleId();
    const evaluationLocator = arbitraryEvaluationLocator();

    it.each([
      [undefined, 'curation-statement'],
      ['review', 'author-response'],
    ])('updates the evaluation type from %s to %s', (initialType, updatedType) => {
      const result = pipe(
        [
          evaluationRecordedWithType(
            articleId,
            evaluationLocator,
            initialType as unknown as EvaluationType,
          ),
          constructEvent('EvaluationUpdated')({
            ...arbitraryEvaluationUpdatedEvent(),
            evaluationLocator,
            evaluationType: updatedType as unknown as EvaluationType,
          }),
        ],
        runQuery(articleId),
      );

      expect(result[0].type).toStrictEqual(O.some(updatedType));
    });
  });

  describe('when the authors of the evaluation are updated', () => {
    const articleId = arbitraryArticleId();
    const evaluationLocator = arbitraryEvaluationLocator();
    const authors = [arbitraryString(), arbitraryString()];
    const result = pipe(
      [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          evaluationLocator,
          articleId,
        },
        {
          ...arbitraryEvaluationUpdatedEvent(),
          evaluationLocator,
          authors,
        },
      ],
      runQuery(articleId),
    );

    it('updates evaluation authors', () => {
      expect(result[0].authors).toStrictEqual(authors);
    });
  });

  describe('when the evaluation has been recorded multiple times', () => {
    const articleId = arbitraryArticleId();
    const evaluationLocator = arbitraryEvaluationLocator();
    const actualEvaluations = pipe(
      [
        evaluationRecorded(articleId, evaluationLocator),
        evaluationRecorded(articleId, evaluationLocator),
      ],
      runQuery(articleId),
      RA.map((evaluation) => evaluation.evaluationLocator),
    );

    it('returns only one evaluation', () => {
      expect(actualEvaluations).toHaveLength(1);
    });
  });
});
