import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructDocmapArrayWithActionDoiUnderTest } from './docmap-array-fixture';
import {
  retrieveActionDoiFromDocmap,
} from '../../../../src/ingest/evaluation-discovery/coar/retrieve-action-doi-from-docmap';
import { arbitraryString, arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('retrieve-action-doi-from-docmap', () => {
  describe('when the request to the docmap uri fails', () => {
    const docmapUri = arbitraryUri();
    let result: E.Either<string, unknown>;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveActionDoiFromDocmap({
          fetchData: () => TE.left('fetch data fails for any reason'),
          fetchHead: () => TE.right(shouldNotBeCalled()),
        }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the request to the docmap uri returns a docmap with an action doi', () => {
    const docmapUri = arbitraryUri();
    const actionDoi = arbitraryString();
    let result: unknown;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveActionDoiFromDocmap({
          fetchData: <D>() => TE.right(constructDocmapArrayWithActionDoiUnderTest(actionDoi) as unknown as D),
          fetchHead: () => TE.right(shouldNotBeCalled()),
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it.skip('returns an action doi', () => {
      expect(result).toStrictEqual(actionDoi);
    });
  });

  describe('when the request to the docmap uri does not return an array', () => {
    const docmapUri = arbitraryUri();
    let result: E.Either<string, unknown>;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveActionDoiFromDocmap({
          fetchData: <D>() => TE.right({} as D),
          fetchHead: () => TE.right(shouldNotBeCalled()),
        }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the request to the docmap uri returns an empty array', () => {
    const docmapUri = arbitraryUri();
    let result: E.Either<string, unknown>;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveActionDoiFromDocmap({
          fetchData: <D>() => TE.right([] as D),
          fetchHead: () => TE.right(shouldNotBeCalled()),
        }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the request to the docmap uri returns a docmap without an action doi', () => {
    it.todo('returns on the left');
  });
});
