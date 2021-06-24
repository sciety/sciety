import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userFollowedEditorialCommunity } from '../../../src/types/domain-events';
import { Page } from '../../../src/types/page';
import { RenderPageError } from '../../../src/types/render-page-error';
import { groupInformationUnavailable } from '../../../src/user-page/followed-groups-page/follow-list';
import { followedGroupsPage } from '../../../src/user-page/followed-groups-page/followed-groups-page';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const contentOf = (page: TE.TaskEither<RenderPageError, Page>) => pipe(
  page,
  TE.match(
    (errorPage) => errorPage.message,
    (p) => p.content,
  ),
);

describe('followed-groups-page', () => {
  it('shows groups as the active tab', async () => {
    const ports = {
      follows: shouldNotBeCalled,
      getGroup: shouldNotBeCalled,
      getUserDetails: () => TE.right({
        avatarUrl: arbitraryUri(),
        displayName: arbitraryString(),
        handle: arbitraryWord(),
      }),
      getAllEvents: T.of([]),
    };
    const params = { id: arbitraryUserId(), user: O.none };
    const page = await pipe(
      params,
      followedGroupsPage(ports),
      contentOf,
      T.map(JSDOM.fragment),
    )();
    const tabHeading = page.querySelector('.tab--active')?.innerHTML;

    expect(tabHeading).toContain('Followed groups');
  });

  it.todo('shows the articles tab as the inactive tab');

  it('uses the user displayname as page title', async () => {
    const userDisplayName = arbitraryString();
    const ports = {
      follows: shouldNotBeCalled,
      getGroup: shouldNotBeCalled,
      getUserDetails: () => TE.right({
        avatarUrl: arbitraryUri(),
        displayName: userDisplayName,
        handle: arbitraryWord(),
      }),
      getAllEvents: T.of([]),
    };
    const params = { id: arbitraryUserId(), user: O.none };
    const page = await pipe(
      params,
      followedGroupsPage(ports),
    )();

    expect(page).toStrictEqual(E.right(expect.objectContaining({ title: userDisplayName })));
  });

  describe('user is following groups', () => {
    it('displays followed groups as group cards', async () => {
      const userId = arbitraryUserId();
      const ports = {
        follows: shouldNotBeCalled,
        getGroup: () => TO.some({
          id: arbitraryGroupId(),
          name: arbitraryString(),
          avatarPath: arbitraryString(),
          descriptionPath: arbitraryString(),
          shortDescription: arbitraryString(),
        }),
        getUserDetails: () => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
          handle: arbitraryWord(),
        }),
        getAllEvents: T.of([
          userFollowedEditorialCommunity(userId, arbitraryGroupId()),
          userFollowedEditorialCommunity(userId, arbitraryGroupId()),
        ]),
      };
      const params = { id: userId, user: O.none };
      const page = await pipe(
        params,
        followedGroupsPage(ports),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const groupCards = page.querySelectorAll('.group-card');

      expect(groupCards).toHaveLength(2);
    });

    describe('any of the group card generations fail', () => {
      it('displays a single error message as the tab panel content', async () => {
        const userId = arbitraryUserId();
        const ports = {
          follows: shouldNotBeCalled,
          getGroup: () => TO.none,
          getUserDetails: () => TE.right({
            avatarUrl: arbitraryUri(),
            displayName: arbitraryString(),
            handle: arbitraryWord(),
          }),
          getAllEvents: T.of([
            userFollowedEditorialCommunity(userId, arbitraryGroupId()),
            userFollowedEditorialCommunity(userId, arbitraryGroupId()),
          ]),
        };
        const params = { id: userId, user: O.none };

        const content = await pipe(
          params,
          followedGroupsPage(ports),
          TE.match(
            shouldNotBeCalled,
            (page) => page.content,
          ),
          T.map(JSDOM.fragment),
        )();

        const tabPanelContent = content.querySelector('.tab-panel')?.innerHTML;

        expect(tabPanelContent).toContain(groupInformationUnavailable);
      });
    });
  });
});
