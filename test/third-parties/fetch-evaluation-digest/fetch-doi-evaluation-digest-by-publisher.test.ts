import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { fetchDoiEvaluationDigestByPublisher } from '../../../src/third-parties/fetch-evaluation-digest/fetch-doi-evaluation-digest-by-publisher';
import * as DE from '../../../src/types/data-error';
import { SanitisedHtmlFragment } from '../../../src/types/sanitised-html-fragment';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryNumber, arbitrarySanitisedHtmlFragment } from '../../helpers';
import { arbitraryDataError } from '../../types/data-error.helper';

const digest = arbitrarySanitisedHtmlFragment();
const arbitraryDoiPrefix = () => `10.${arbitraryNumber(1, 9999)}`;

describe('fetch-doi-evaluation-digest-by-publisher', () => {
  let result: E.Either<DE.DataError, SanitisedHtmlFragment>;

  describe('when a doi with a configured prefix is passed in', () => {
    const configuredDoiPrefix = arbitraryDoiPrefix();

    describe('when the delegated doi fetcher returns a right', () => {
      const evaluationFetchersConfiguration = {
        [configuredDoiPrefix]: () => TE.right(digest),
      };

      beforeEach(async () => {
        result = await fetchDoiEvaluationDigestByPublisher(evaluationFetchersConfiguration, dummyLogger)(`${configuredDoiPrefix}/123`)();
      });

      it('returns a right', () => {
        expect(result).toStrictEqual(E.right(digest));
      });
    });

    describe('when the delegated doi fetcher returns a left', () => {
      const dataError = arbitraryDataError();
      const evaluationFetchersConfiguration = {
        [configuredDoiPrefix]: () => TE.left(dataError),
      };

      beforeEach(async () => {
        result = await fetchDoiEvaluationDigestByPublisher(evaluationFetchersConfiguration, dummyLogger)(`${configuredDoiPrefix}/123`)();
      });

      it('returns a left', () => {
        expect(result).toStrictEqual(E.left(dataError));
      });
    });
  });

  describe('when a doi with an unknown prefix is passed in', () => {
    const unknownDoiPrefix = arbitraryDoiPrefix();
    const evaluationFetchersConfiguration = {
      [arbitraryDoiPrefix()]: () => TE.right(digest),
    };

    beforeEach(async () => {
      result = await fetchDoiEvaluationDigestByPublisher(evaluationFetchersConfiguration, dummyLogger)(`${unknownDoiPrefix}/123`)();
    });

    it('returns unavailable', () => {
      expect(result).toStrictEqual(E.left(DE.unavailable));
    });
  });
});
