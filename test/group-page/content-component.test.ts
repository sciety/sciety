import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userFollowedEditorialCommunity } from '../../src/domain-events';
import { listCreated } from '../../src/domain-events/list-created-event';
import { contentComponent } from '../../src/group-page/content-component';
import { arbitraryString } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('content-component', () => {
  const group = arbitraryGroup();
  const events = [
    listCreated(arbitraryListId(), arbitraryString(), arbitraryString(), group.id),
    userFollowedEditorialCommunity(arbitraryUserId(), group.id),
    userFollowedEditorialCommunity(arbitraryUserId(), group.id),
  ];
  const ports = {
    fetchStaticFile: () => TE.right(''),
    getUserDetailsBatch: () => TE.right([]),
    getAllEvents: T.of(events),
    getGroup: () => TE.right(group),
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
    const followersTabLabel = content.querySelector('.tab:nth-child(3)')?.textContent;

    expect(followersTabLabel).toContain('(2)');
  });
});
