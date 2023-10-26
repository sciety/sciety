import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import * as DE from '../../src/types/data-error';
import { fetchDoiEvaluationByPublisher } from '../../src/third-parties/fetch-doi-evaluation-by-publisher';
import { Evaluation } from '../../src/types/evaluation';
import { arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryUri } from '../helpers';

const arbitraryEvaluation: Evaluation = {
  fullText: arbitrarySanitisedHtmlFragment(),
  url: new URL(arbitraryUri()),
};

describe('fetch-doi-evaluation-by-publisher', () => {
  describe('when a doi with a configured prefix is passed in', () => {
    describe('when the delegated doi fetcher returns a right', () => {
      const doiPrefix = arbitraryString();
      const evaluationFetchersConfiguration = {
        [doiPrefix]: () => TE.right(arbitraryEvaluation),
      };
      let result: E.Either<DE.DataError, Evaluation>;

      beforeEach(async () => {
        result = await fetchDoiEvaluationByPublisher(evaluationFetchersConfiguration)(`${doiPrefix}/123`)();
      });

      it('returns a right', () => {
        expect(result).toStrictEqual(E.right(arbitraryEvaluation));
      });
    });

    describe('when the delegated doi fetcher returns a left', () => {
      it.todo('returns a left');
    });
  });

  describe('when a doi with an unknown prefix is passed in', () => {
    const doiPrefix = arbitraryString();
    const evaluationFetchersConfiguration = {
      [arbitraryString()]: () => TE.right(arbitraryEvaluation),
    };
    let result: E.Either<DE.DataError, Evaluation>;

    beforeEach(async () => {
      result = await fetchDoiEvaluationByPublisher(evaluationFetchersConfiguration)(`${doiPrefix}/123`)();
    });

    it('returns unavailable', () => {
      expect(result).toStrictEqual(E.left(DE.unavailable));
    });
  });
});
