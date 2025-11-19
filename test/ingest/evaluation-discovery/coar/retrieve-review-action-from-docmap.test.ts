import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  constructDocmapArrayWithoutReviewAction,
  constructDocmapArrayWithReviewAction,
} from './docmap-array-fixture';
import {
  retrieveReviewActionsFromDocmap, ReviewActionsFromDocmap,
} from '../../../../src/ingest/evaluation-discovery/coar/retrieve-review-actions-from-docmap';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

const retrieveQueryResultErrorMessage = (result: E.Either<string, ReviewActionsFromDocmap>): string => pipe(
  result,
  E.map(shouldNotBeCalled),
  E.getOrElse((e) => e),
);

describe('retrieve-review-actions-from-docmap', () => {
  describe('when the request to the docmap uri fails', () => {
    const docmapUri = arbitraryUri();
    let result: E.Either<string, ReviewActionsFromDocmap>;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveReviewActionsFromDocmap({
          fetchData: () => TE.left('fetch data fails for any reason'),
          fetchHead: () => TE.right(shouldNotBeCalled()),
        }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the request to the docmap uri returns a docmap with a review action', () => {
    const docmapUri = arbitraryUri();
    const inputUnderTest = {
      actionOutputDoi: arbitraryString(),
      actionOutputDate: arbitraryDate().toISOString(),
      actionInputDoi: arbitraryString(),
    };
    let result: ReviewActionsFromDocmap;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveReviewActionsFromDocmap({
          fetchData: <D>() => TE.right(constructDocmapArrayWithReviewAction(inputUnderTest) as unknown as D),
          fetchHead: () => TE.right(shouldNotBeCalled()),
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns a review action', () => {
      expect(result).toStrictEqual([inputUnderTest]);
    });
  });

  describe('when the request to the docmap uri returns a docmap with two review actions', () => {
    it.todo('returns the review actions');
  });

  describe('when the request to the docmap uri does not return an array', () => {
    const docmapUri = arbitraryUri();
    let result: E.Either<string, ReviewActionsFromDocmap>;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveReviewActionsFromDocmap({
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
    let result: E.Either<string, ReviewActionsFromDocmap>;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveReviewActionsFromDocmap({
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
    let result: E.Either<string, ReviewActionsFromDocmap>;

    beforeEach(async () => {
      result = await pipe(
        docmapUri,
        retrieveReviewActionsFromDocmap({
          fetchData: <D>() => TE.right(constructDocmapArrayWithoutReviewAction() as unknown as D),
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
