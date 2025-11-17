import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  constructDocmapArrayWithActionDoiUnderTest,
  constructDocmapArrayWithoutActionDoiUnderTest,
} from './docmap-array-fixture';
import {
  retrieveActionDoiFromDocmap,
} from '../../../../src/ingest/evaluation-discovery/coar/retrieve-action-doi-from-docmap';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

const retrieveQueryResultErrorMessage = (result: E.Either<string, { actionDoi: string }>): string => pipe(
  result,
  E.map(shouldNotBeCalled),
  E.getOrElse((e) => e),
);

describe('retrieve-action-doi-from-docmap', () => {
  describe('when the request to the docmap uri fails', () => {
    const docmapUri = arbitraryUri();
    let result: E.Either<string, { actionDoi: string }>;

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
    const actionDate = arbitraryDate().toISOString();
    const inputUnderTest = { actionDoi, actionDate };
    let result: { actionDoi: string, actionDate: string };

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveActionDoiFromDocmap({
          fetchData: <D>() => TE.right(constructDocmapArrayWithActionDoiUnderTest(inputUnderTest) as unknown as D),
          fetchHead: () => TE.right(shouldNotBeCalled()),
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an action doi', () => {
      expect(result.actionDoi).toStrictEqual(actionDoi);
    });

    it('returns a date of an action', () => {
      expect(result.actionDate).toStrictEqual(actionDate);
    });

    it.todo('returns an action input doi');
  });

  describe('when the request to the docmap uri does not return an array', () => {
    const docmapUri = arbitraryUri();
    let result: E.Either<string, { actionDoi: string }>;

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
    let result: E.Either<string, { actionDoi: string }>;

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
    const docmapUri = arbitraryUri();
    let result: E.Either<string, { actionDoi: string }>;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveActionDoiFromDocmap({
          fetchData: <D>() => TE.right(constructDocmapArrayWithoutActionDoiUnderTest() as unknown as D),
          fetchHead: () => TE.right(shouldNotBeCalled()),
        }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
      expect(retrieveQueryResultErrorMessage(result)).toBe('No Action DOI found.');
    });
  });
});
