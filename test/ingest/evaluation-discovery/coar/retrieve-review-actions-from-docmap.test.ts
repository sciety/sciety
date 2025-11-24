import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  arbitraryDocmapReviewAction,
  constructMinimalDocmapStepWithoutReviewActions,
  constructMinimalDocmapStepWithReviewActions,
  constructMinimalDocmapWithSteps,
} from './docmap-array-fixture';
import {
  retrieveReviewActionsFromDocmap, ReviewActionFromDocmap,
} from '../../../../src/ingest/evaluation-discovery/coar/retrieve-review-actions-from-docmap';
import { arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('retrieve-review-actions-from-docmap', () => {
  describe('when the request to the docmap uri returns a docmap', () => {
    const docmapReviewAction1 = arbitraryDocmapReviewAction();
    const docmapReviewAction2 = arbitraryDocmapReviewAction();
    const expectedResultForReviewAction1 = {
      actionOutputDoi: docmapReviewAction1.outputs[0].doi,
      actionOutputDate: docmapReviewAction1.outputs[0].published,
      actionInputDoi: docmapReviewAction1.inputs[0].doi,
    };
    const expectedResultForReviewAction2 = {
      actionOutputDoi: docmapReviewAction2.outputs[0].doi,
      actionOutputDate: docmapReviewAction2.outputs[0].published,
      actionInputDoi: docmapReviewAction2.inputs[0].doi,
    };

    describe('with one review action', () => {
      const docmapUri = arbitraryUri();
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      const docmap = constructMinimalDocmapWithSteps(
        {
          '_:b1': constructMinimalDocmapStepWithReviewActions([docmapReviewAction1]),
        },
      );

      beforeEach(async () => {
        result = await pipe(
          docmapUri,
          retrieveReviewActionsFromDocmap({
            fetchData: <D>() => TE.right([docmap] as unknown as D),
            fetchHead: () => TE.right(shouldNotBeCalled()),
          }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns a review action', () => {
        expect(result).toStrictEqual([expectedResultForReviewAction1]);
      });
    });

    describe('with one review action and additional steps without review actions', () => {
      const docmapUri = arbitraryUri();
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      const docmap = constructMinimalDocmapWithSteps(
        {
          '_:b1': constructMinimalDocmapStepWithReviewActions([docmapReviewAction1]),
          '_:b2': constructMinimalDocmapStepWithoutReviewActions(),
        },
      );

      beforeEach(async () => {
        result = await pipe(
          docmapUri,
          retrieveReviewActionsFromDocmap({
            fetchData: <D>() => TE.right([docmap] as unknown as D),
            fetchHead: () => TE.right(shouldNotBeCalled()),
          }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns a review action, ignoring other steps', () => {
        expect(result).toStrictEqual([expectedResultForReviewAction1]);
      });
    });

    describe('with two review actions', () => {
      const docmapUri = arbitraryUri();
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      const docmap = constructMinimalDocmapWithSteps(
        {
          '_:b1': constructMinimalDocmapStepWithReviewActions([docmapReviewAction1, docmapReviewAction2]),
        },
      );

      beforeEach(async () => {
        result = await pipe(
          docmapUri,
          retrieveReviewActionsFromDocmap({
            fetchData: <D>() => TE.right(
              [docmap] as unknown as D,
            ),
            fetchHead: () => TE.right(shouldNotBeCalled()),
          }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns the review actions', () => {
        expect(result).toStrictEqual([expectedResultForReviewAction1, expectedResultForReviewAction2]);
      });
    });

    describe('with two review actions in two different steps', () => {
      const docmapUri = arbitraryUri();
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      const docmap = constructMinimalDocmapWithSteps(
        {
          '_:b1': constructMinimalDocmapStepWithReviewActions([docmapReviewAction1]),
          '_:b3': constructMinimalDocmapStepWithReviewActions([docmapReviewAction2]),
        },
      );

      beforeEach(async () => {
        result = await pipe(
          docmapUri,
          retrieveReviewActionsFromDocmap({
            fetchData: <D>() => TE.right(
              [docmap] as unknown as D,
            ),
            fetchHead: () => TE.right(shouldNotBeCalled()),
          }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns the review actions', () => {
        expect(result).toStrictEqual([expectedResultForReviewAction1, expectedResultForReviewAction2]);
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
