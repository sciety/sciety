import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DependenciesForViews } from '../../../../../../src/read-side/dependencies-for-views';
import { Action } from '../../../../../../src/read-side/non-html-views/docmaps/docmap/action';
import { constructAction } from '../../../../../../src/read-side/non-html-views/docmaps/docmap/construct-view-model/construct-action';
import { TestFramework, createTestFramework } from '../../../../../framework';
import { arbitraryUrl } from '../../../../../helpers';
import { shouldNotBeCalled } from '../../../../../should-not-be-called';
import { arbitraryDataError } from '../../../../../types/data-error.helper';
import { arbitraryRecordedEvaluation } from '../../../../../types/recorded-evaluation.helper';

describe('construct-action', () => {
  const webContentBase = arbitraryUrl();
  let framework: TestFramework;
  let defaultDependencies: DependenciesForViews;

  beforeEach(async () => {
    framework = createTestFramework();
    defaultDependencies = framework.dependenciesForViews;
  });

  describe('when the human readable original url can be fetched', () => {
    const humanReadableOriginalUrl = arbitraryUrl();
    let action: Action;

    beforeEach(async () => {
      action = await pipe(
        arbitraryRecordedEvaluation(),
        constructAction(
          {
            ...defaultDependencies,
            fetchEvaluationHumanReadableOriginalUrl: () => TE.right(humanReadableOriginalUrl),
          },
          webContentBase,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('the provided url is used as the sourceUrl', () => {
      expect(action.sourceUrl).toStrictEqual(humanReadableOriginalUrl);
    });

    it.failing('constructs webContentUrl, using the appOrigin', () => {
      expect(action.webContentUrl.toString()).toStrictEqual(expect.stringContaining(webContentBase.toString()));
    });
  });

  describe('when the human readable original url can not be fetched', () => {
    const dataError = arbitraryDataError();
    let result: E.Either<unknown, unknown>;

    beforeEach(async () => {
      result = await pipe(
        arbitraryRecordedEvaluation(),
        constructAction(
          {
            ...defaultDependencies,
            fetchEvaluationHumanReadableOriginalUrl: () => TE.left(dataError),
          },
          webContentBase,
        ),
      )();
    });

    it('returns the left from the fetcher', () => {
      expect(result).toStrictEqual(E.left(dataError));
    });
  });
});
