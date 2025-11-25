import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  exampleDocmapResponseReviewAction,
  constructMinimalDocmapResponseExampleStepWithoutReviewActions,
  constructMinimalDocmapResponseExampleStepWithReviewActions,
  constructMinimalDocmapResponseExampleWithSteps,
} from './docmap-array-fixture';
import {
  retrieveReviewActionsFromDocmap, ReviewActionFromDocmap,
} from '../../../../src/ingest/evaluation-discovery/coar/retrieve-review-actions-from-docmap';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

const runQuery = (uri: string, response: unknown) => pipe(
  uri,
  retrieveReviewActionsFromDocmap({
    fetchData: <D>() => TE.right([response] as unknown as D),
    fetchHead: () => TE.right(shouldNotBeCalled()),
  }),
);

const runQueryHappyPath = (uri: string, docmapResponse: unknown) => pipe(
  runQuery(uri, docmapResponse),
  TE.getOrElse(shouldNotBeCalled),
);

describe('retrieve-review-actions-from-docmap', () => {
  describe('when the request to the docmap uri returns a docmap', () => {
    const outputDoi1 = arbitraryString();
    const outputPublishedDate1 = arbitraryDate();
    const inputDoi1 = arbitraryString();
    const outputDoi2 = arbitraryString();
    const outputPublishedDate2 = arbitraryDate();
    const inputDoi2 = arbitraryString();
    const docmapReviewAction1 = exampleDocmapResponseReviewAction(outputDoi1, outputPublishedDate1, inputDoi1);
    const docmapReviewAction2 = exampleDocmapResponseReviewAction(outputDoi2, outputPublishedDate2, inputDoi2);
    const expectedResultForReviewAction1 = {
      actionOutputDoi: outputDoi1,
      actionOutputDate: outputPublishedDate1.toISOString(),
      actionInputDoi: inputDoi1,
    };
    const expectedResultForReviewAction2 = {
      actionOutputDoi: outputDoi2,
      actionOutputDate: outputPublishedDate2.toISOString(),
      actionInputDoi: inputDoi2,
    };

    describe('with one review action', () => {
      const docmapUri = arbitraryUri();
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      const docmap = constructMinimalDocmapResponseExampleWithSteps(
        {
          '_:b1': constructMinimalDocmapResponseExampleStepWithReviewActions([docmapReviewAction1]),
        },
      );

      beforeEach(async () => {
        result = await runQueryHappyPath(docmapUri, docmap)();
      });

      it('returns a review action', () => {
        expect(result).toStrictEqual([expectedResultForReviewAction1]);
      });
    });

    describe('with one review action and additional steps without review actions', () => {
      const docmapUri = arbitraryUri();
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      const docmap = constructMinimalDocmapResponseExampleWithSteps(
        {
          '_:b1': constructMinimalDocmapResponseExampleStepWithReviewActions([docmapReviewAction1]),
          '_:b2': constructMinimalDocmapResponseExampleStepWithoutReviewActions(),
        },
      );

      beforeEach(async () => {
        result = await runQueryHappyPath(docmapUri, docmap)();
      });

      it('returns a review action, ignoring other steps', () => {
        expect(result).toStrictEqual([expectedResultForReviewAction1]);
      });
    });

    describe('with two review actions', () => {
      const docmapUri = arbitraryUri();
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      const docmap = constructMinimalDocmapResponseExampleWithSteps(
        {
          '_:b1': constructMinimalDocmapResponseExampleStepWithReviewActions([docmapReviewAction1, docmapReviewAction2]),
        },
      );

      beforeEach(async () => {
        result = await runQueryHappyPath(docmapUri, docmap)();
      });

      it('returns the review actions', () => {
        expect(result).toStrictEqual([expectedResultForReviewAction1, expectedResultForReviewAction2]);
      });
    });

    describe('with two review actions in two different steps', () => {
      const docmapUri = arbitraryUri();
      let result: ReadonlyArray<ReviewActionFromDocmap>;

      const docmap = constructMinimalDocmapResponseExampleWithSteps(
        {
          '_:b1': constructMinimalDocmapResponseExampleStepWithReviewActions([docmapReviewAction1]),
          '_:b3': constructMinimalDocmapResponseExampleStepWithReviewActions([docmapReviewAction2]),
        },
      );

      beforeEach(async () => {
        result = await runQueryHappyPath(docmapUri, docmap)();
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
        result = await runQuery(docmapUri, [])();
      });

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('does not return an array', () => {
      const docmapUri = arbitraryUri();
      let result: E.Either<string, ReadonlyArray<ReviewActionFromDocmap>>;

      beforeEach(async () => {
        result = await runQuery(docmapUri, {})();
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
