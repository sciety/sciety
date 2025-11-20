import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  constructDocmapArrayWithoutReviewAction,
  constructDocmapArrayWithReviewActions, arbitraryDocmapReviewAction,
} from './docmap-array-fixture';
import {
  retrieveReviewActionsFromDocmap, ReviewActionFromDocmap,
} from '../../../../src/ingest/evaluation-discovery/coar/retrieve-review-actions-from-docmap';
import { arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

const retrieveQueryResultErrorMessage = (
  result: E.Either<string, ReadonlyArray<ReviewActionFromDocmap>>,
): string => pipe(
  result,
  E.map(shouldNotBeCalled),
  E.getOrElse((e) => e),
);

describe('retrieve-review-actions-from-docmap', () => {
  describe('when the request to the docmap uri returns a docmap', () => {
    describe('with one review action', () => {
      const docmapUri = arbitraryUri();
      const docmapReviewAction = arbitraryDocmapReviewAction();
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      beforeEach(async () => {
        result = await pipe(
          docmapUri,
          retrieveReviewActionsFromDocmap({
            fetchData: <D>() => TE.right(constructDocmapArrayWithReviewActions([docmapReviewAction]) as unknown as D),
            fetchHead: () => TE.right(shouldNotBeCalled()),
          }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns a review action', () => {
        expect(result).toStrictEqual([{
          actionOutputDoi: docmapReviewAction.outputs[0].doi,
          actionOutputDate: docmapReviewAction.outputs[0].published,
          actionInputDoi: docmapReviewAction.inputs[0].doi,
        }]);
      });
    });

    describe('with two review actions', () => {
      const docmapUri = arbitraryUri();
      const docmapReviewAction1 = arbitraryDocmapReviewAction();
      const docmapReviewAction2 = arbitraryDocmapReviewAction();
      const expectedResult = [{
        actionOutputDoi: docmapReviewAction1.outputs[0].doi,
        actionOutputDate: docmapReviewAction1.outputs[0].published,
        actionInputDoi: docmapReviewAction1.inputs[0].doi,
      },
      {
        actionOutputDoi: docmapReviewAction2.outputs[0].doi,
        actionOutputDate: docmapReviewAction2.outputs[0].published,
        actionInputDoi: docmapReviewAction2.inputs[0].doi,
      }];
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      beforeEach(async () => {
        result = await pipe(
          docmapUri,
          retrieveReviewActionsFromDocmap({
            fetchData: <D>() => TE.right(
              constructDocmapArrayWithReviewActions([docmapReviewAction1, docmapReviewAction2]) as unknown as D,
            ),
            fetchHead: () => TE.right(shouldNotBeCalled()),
          }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns the review actions', () => {
        expect(result).toStrictEqual(expectedResult);
      });
    });

    describe('without an action doi', () => {
      const docmapUri = arbitraryUri();
      let result: E.Either<string, ReadonlyArray<ReviewActionFromDocmap>>;

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

  describe('when the request to the docmap', () => {
    describe('returns an empty array', () => {
      const docmapUri = arbitraryUri();
      let result: E.Either<string, ReadonlyArray<ReviewActionFromDocmap>>;

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

    describe('does not return an array', () => {
      const docmapUri = arbitraryUri();
      let result: E.Either<string, ReadonlyArray<ReviewActionFromDocmap>>;

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
  });

  describe('when the request to the docmap uri fails', () => {
    const docmapUri = arbitraryUri();
    let result: E.Either<string, ReadonlyArray<ReviewActionFromDocmap>>;

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
});
