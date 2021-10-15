import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { contentComponent } from '../../src/group-page/content-component';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroup } from '../types/group.helper';

describe.skip('content-component', () => {
  const group = arbitraryGroup();
  const ports = {
    fetchStaticFile: () => TE.right(''),
    getUserDetailsBatch: () => TE.right([]),
    getAllEvents: T.of([]),
  };

  it.each([
    [0 as const],
    [1 as const],
    [2 as const],
  ])('when loading tab index %d displays the followers count on the followers tab label', async (activeTabIndex) => {
    const content = await pipe(
      contentComponent(ports)(group, 1, activeTabIndex),
      TE.getOrElse(shouldNotBeCalled),
      T.map(JSDOM.fragment),
    )();
    const followersTabLabel = content.querySelector('.tab:nth-child(3)');

    expect(followersTabLabel).toMatch(/\(0\)/);
  });
});
