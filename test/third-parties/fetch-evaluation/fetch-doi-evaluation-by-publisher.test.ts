import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { fetchDoiEvaluationByPublisher } from '../../../src/third-parties/fetch-evaluation/fetch-doi-evaluation-by-publisher';
import * as DE from '../../../src/types/data-error';
import { Evaluation } from '../../../src/types/evaluation';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryNumber, arbitrarySanitisedHtmlFragment, arbitraryUri } from '../../helpers';
import { arbitraryDataError } from '../../types/data-error.helper';

const arbitraryEvaluation: Evaluation = {
  fullText: arbitrarySanitisedHtmlFragment(),
  url: new URL(arbitraryUri()),
};
const arbitraryDoiPrefix = () => `10.${arbitraryNumber(1, 9999)}`;

describe('fetch-doi-evaluation-by-publisher', () => {
  let result: E.Either<DE.DataError, Evaluation>;

  describe('when a doi with a configured prefix is passed in', () => {
    const configuredDoiPrefix = arbitraryDoiPrefix();

    describe('when the delegated doi fetcher returns a right', () => {
      const evaluationFetchersConfiguration = {
        [configuredDoiPrefix]: () => TE.right(arbitraryEvaluation),
      };

      beforeEach(async () => {
        result = await fetchDoiEvaluationByPublisher(evaluationFetchersConfiguration, dummyLogger)(`${configuredDoiPrefix}/123`)();
      });

      it('returns a right', () => {
        expect(result).toStrictEqual(E.right(arbitraryEvaluation));
      });
    });

    describe('when the delegated doi fetcher returns a left', () => {
      const dataError = arbitraryDataError();
      const evaluationFetchersConfiguration = {
        [configuredDoiPrefix]: () => TE.left(dataError),
      };

      beforeEach(async () => {
        result = await fetchDoiEvaluationByPublisher(evaluationFetchersConfiguration, dummyLogger)(`${configuredDoiPrefix}/123`)();
      });

      it('returns a left', () => {
        expect(result).toStrictEqual(E.left(dataError));
      });
    });
  });

  describe('when a doi with an unknown prefix is passed in', () => {
    const unknownDoiPrefix = arbitraryDoiPrefix();
    const evaluationFetchersConfiguration = {
      [arbitraryDoiPrefix()]: () => TE.right(arbitraryEvaluation),
    };

    beforeEach(async () => {
      result = await fetchDoiEvaluationByPublisher(evaluationFetchersConfiguration, dummyLogger)(`${unknownDoiPrefix}/123`)();
    });

    it('returns unavailable', () => {
      expect(result).toStrictEqual(E.left(DE.unavailable));
    });
  });
});
