import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { getCurationStatements } from '../../../src/shared-read-models/curation-statements/get-curation-statements';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/curation-statements/handle-event';
import { constructEvent } from '../../../src/domain-events';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';

describe('get-curation-statements', () => {
  describe('when there are curation statements for the article', () => {
    const articleId = arbitraryArticleId();
    const groupId = arbitraryGroupId();
    const evaluationLocatorA = arbitraryEvaluationLocator();
    const evaluationLocatorB = arbitraryEvaluationLocator();
    const readmodel = pipe(
      [
        constructEvent('CurationStatementRecorded')({
          articleId,
          evaluationLocator: evaluationLocatorA,
          groupId,
        }),
        constructEvent('CurationStatementRecorded')({
          articleId,
          evaluationLocator: evaluationLocatorB,
          groupId,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      articleId,
      getCurationStatements(readmodel),
    );

    it('returns them', () => {
      expect(result).toContainEqual(expect.objectContaining({ evaluationLocator: evaluationLocatorA }));
      expect(result).toContainEqual(expect.objectContaining({ evaluationLocator: evaluationLocatorB }));
    });
  });

  describe('when there are no curation statements for the article', () => {
    const articleId = arbitraryArticleId();

    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      articleId,
      getCurationStatements(readmodel),
    );

    it('returns an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
