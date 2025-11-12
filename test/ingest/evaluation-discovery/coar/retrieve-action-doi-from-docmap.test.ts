import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  retrieveActionDoiFromDocmap,
} from '../../../../src/ingest/evaluation-discovery/coar/retrieve-action-doi-from-docmap';
import { arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('retrieve-action-doi-from-docmap', () => {
  describe('when the request to the docmap uri fails', () => {
    const docmapUri = arbitraryUri();
    let result: E.Either<string, string>;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveActionDoiFromDocmap({
          fetchData: () => TE.left('fetch data fails for any reason'),
          fetchHead: () => TE.right(shouldNotBeCalled()),
        }),
      )();
    });

    it.failing('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the request to the docmap uri returns a docmap with an action doi', () => {
    it.todo('returns an action doi');
  });

  describe('when the request to the docmap uri returns a docmap without an action doi', () => {
    it.todo('returns on the left');
  });
});
