import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/article-details';
import { lookupArticleDetails } from '../../../src/shared-read-models/article-details/lookup-article-details';

describe('lookup-article-details', () => {
  const articleId = arbitraryArticleId();

  describe('when no details have been recorded', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns None', () => {
      expect(lookupArticleDetails(readmodel)(articleId)).toStrictEqual(O.none);
    });
  });
});
