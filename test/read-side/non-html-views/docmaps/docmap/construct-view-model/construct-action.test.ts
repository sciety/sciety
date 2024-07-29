import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DependenciesForViews } from '../../../../../../src/read-side/dependencies-for-views';
import { Action } from '../../../../../../src/read-side/non-html-views/docmaps/docmap/action';
import { constructAction } from '../../../../../../src/read-side/non-html-views/docmaps/docmap/construct-view-model/construct-action';
import { TestFramework, createTestFramework } from '../../../../../framework';
import { arbitraryUrl } from '../../../../../helpers';
import { shouldNotBeCalled } from '../../../../../should-not-be-called';
import { arbitraryRecordedEvaluation } from '../../../../../types/recorded-evaluation.helper';

describe('construct-action', () => {
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
        constructAction({
          ...defaultDependencies,
          fetchEvaluationHumanReadableOriginalUrl: () => TE.right(humanReadableOriginalUrl),
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('the provided url is used as the sourceUrl', () => {
      expect(action.sourceUrl).toStrictEqual(humanReadableOriginalUrl);
    });

    it.todo('constructs webContentUrl by hardcoding sciety.org');
  });

  describe('when the human readable original url can not be fetched', () => {
    it.todo('returns on the left');
  });
});
