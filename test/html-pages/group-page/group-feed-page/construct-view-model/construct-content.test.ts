import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { dummyLogger } from '../../../../dummy-logger';
import { ViewModel } from '../../../../../src/html-pages/group-page/group-feed-page/view-model';
import { createTestFramework, TestFramework } from '../../../../framework';
import { arbitraryGroup } from '../../../../types/group.helper';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { constructContent } from '../../../../../src/html-pages/group-page/group-feed-page/construct-view-model/construct-content';

describe('construct-content', () => {
  let framework: TestFramework;
  const group = arbitraryGroup();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has evaluated articles', () => {
    it.todo('contains article cards');
  });

  describe('when the group has no evaluated articles', () => {
    let viewModel: ViewModel['content'];

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);

      viewModel = await pipe(
        constructContent({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          logger: dummyLogger,
        },
        group.id),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('contains a no-activity-yet message', () => {
      expect(viewModel).toBe('no-activity-yet');
    });
  });
});
