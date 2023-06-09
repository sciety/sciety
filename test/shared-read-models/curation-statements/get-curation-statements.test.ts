import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { getCurationStatements } from '../../../src/shared-read-models/curation-statements/get-curation-statements';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/curation-statements/handle-event';

describe('get-curation-statements', () => {
  describe('when there are curation statements for the article', () => {
    it.todo('returns them');
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
