import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import * as LOID from '../../../src/types/list-owner-id';
import { groupJoined, userFollowedEditorialCommunity } from '../../../src/domain-events';
import { ListOwnerId } from '../../../src/types/list-owner-id';
import { Page } from '../../../src/types/page';
import { RenderPageError } from '../../../src/types/render-page-error';
import { followingNothing, informationUnavailable } from '../../../src/html-pages/user-page/render-as-html';
import { Ports, userPage } from '../../../src/html-pages/user-page';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../helpers';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryUserHandle } from '../../types/user-handle.helper';
import { arbitraryCandidateUserHandle } from '../../types/candidate-user-handle.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryList } from '../../types/list-helper';
import { CandidateUserHandle } from '../../../src/types/candidate-user-handle';

const contentOf = (page: TE.TaskEither<RenderPageError, Page>) => pipe(
  page,
  TE.match(
    (errorPage) => errorPage.message,
    (p) => p.content,
  ),
);

const listId = arbitraryListId();

const defaultAdapters: Ports = {
  getGroup: () => O.some(arbitraryGroup()),
  getAllEvents: T.of([]),
  getFollowers: () => [],
  getGroupsFollowedBy: () => [arbitraryGroupId()],
  lookupUserByHandle: () => O.some(arbitraryUserDetails()),
  selectAllListsOwnedBy: (ownerId: ListOwnerId) => [{
    id: listId,
    ownerId,
    articleIds: [],
    lastUpdated: arbitraryDate(),
    name: arbitraryString(),
    description: arbitraryString(),
  }],
};

const defaultParams = { handle: arbitraryCandidateUserHandle(), user: O.none };

describe('user-page', () => {
  describe.each([
    ['lists'],
    ['followed-groups'],
  ])('page tab: %s', (tabName: string) => {
    it('uses the user displayname as page title', async () => {
      const userDisplayName = arbitraryString();
      const ports: Ports = {
        ...defaultAdapters,
        lookupUserByHandle: () => O.some({
          ...arbitraryUserDetails(),
          displayName: userDisplayName,
        }),
      };
      const page = await pipe(
        defaultParams,
        userPage(ports)(tabName),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({ title: userDisplayName })));
    });

    it('accepts handle as a string', async () => {
      const page = await pipe(
        defaultParams,
        userPage(defaultAdapters)(tabName),
      )();

      expect(E.isRight(page)).toBe(true);
    });

    it('uses the user displayname as the opengraph title', async () => {
      const userDisplayName = arbitraryString();
      const ports: Ports = {
        ...defaultAdapters,
        lookupUserByHandle: () => O.some({
          ...arbitraryUserDetails(),
          displayName: userDisplayName,
        }),
      };
      const page = await pipe(
        defaultParams,
        userPage(ports)(tabName),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({
        openGraph: expect.objectContaining({
          title: userDisplayName,
        }),
      })));
    });

    describe('opengraph description', () => {
      const user = arbitraryUserDetails();
      const secondList = {
        ...arbitraryList(),
        ownerId: LOID.fromUserId(user.id),
      };
      const groupId1 = arbitraryGroupId();
      const groupId2 = arbitraryGroupId();
      let framework: TestFramework;

      beforeEach(async () => {
        framework = createTestFramework();
        await framework.commandHelpers.createUserAccount(user);
        await framework.commandHelpers.createList(secondList);
        await framework.commandHelpers.followGroup(user.id, groupId1);
        await framework.commandHelpers.followGroup(user.id, groupId2);
      });

      it('includes the count of lists and followed groups', async () => {
        const adapters: Ports = {
          ...framework.queries,
          getAllEvents: framework.getAllEvents,
        };
        const page = await pipe(
          {
            handle: user.handle as string as CandidateUserHandle,
            user: O.some(user),
          },
          userPage(adapters)(tabName),
        )();

        expect(page).toStrictEqual(E.right(expect.objectContaining({
          openGraph: expect.objectContaining({
            description: '2 lists | Following 2 groups',
          }),
        })));
      });
    });

    it('shows the user details', async () => {
      const avatarUrl = arbitraryUri();
      const displayName = arbitraryString();
      const handle = arbitraryUserHandle();
      const ports: Ports = {
        ...defaultAdapters,
        lookupUserByHandle: () => O.some({
          avatarUrl,
          displayName,
          handle,
          id: arbitraryUserId(),
        }),
      };

      const pageHtml = await contentOf(userPage(ports)(tabName)(defaultParams))();

      expect(pageHtml).toContain(avatarUrl);
      expect(pageHtml).toContain(displayName);
      expect(pageHtml).toContain(handle);
    });

    it('shows the following count in the tab title', async () => {
      const user = arbitraryUserDetails();
      const ports: Ports = {
        ...defaultAdapters,
        lookupUserByHandle: () => O.some(user),
        getAllEvents: T.of([userFollowedEditorialCommunity(user.id, arbitraryGroupId())]),
      };
      const page = await pipe(
        defaultParams,
        userPage(ports)(tabName),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const tabHeadings = page.querySelectorAll('.tab');
      const headings = Array.from(tabHeadings).map((tab) => tab.innerHTML);

      expect(headings[1]).toContain('Following (1)');
    });
  });

  describe('followed-groups tab', () => {
    it('shows groups as the active tab', async () => {
      const page = await pipe(
        defaultParams,
        userPage(defaultAdapters)('followed-groups'),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const tabHeading = page.querySelector('.tab--active')?.innerHTML;

      expect(tabHeading).toContain('Following');
    });

    describe('user is following groups', () => {
      it('displays followed groups as group cards', async () => {
        const group1 = arbitraryGroup();
        const group2 = arbitraryGroup();
        const user = arbitraryUserDetails();
        const ports: Ports = {
          ...defaultAdapters,
          getAllEvents: T.of([
            groupJoined(
              group1.id,
              group1.name,
              group1.avatarPath,
              group1.descriptionPath,
              group1.shortDescription,
              group1.homepage,
              group1.slug,
            ),
            groupJoined(
              group2.id,
              group2.name,
              group2.avatarPath,
              group2.descriptionPath,
              group2.shortDescription,
              group2.homepage,
              group2.slug,
            ),
            userFollowedEditorialCommunity(user.id, group1.id),
            userFollowedEditorialCommunity(user.id, group2.id),
          ]),
          getGroupsFollowedBy: () => [group1.id, group2.id],
          lookupUserByHandle: () => O.some(user),
        };
        const page = await pipe(
          defaultParams,
          userPage(ports)('followed-groups'),
          contentOf,
          T.map(JSDOM.fragment),
        )();
        const groupCards = page.querySelectorAll('.group-card');

        expect(groupCards).toHaveLength(2);
      });

      describe('any of the group card generations fail', () => {
        it('displays a single error message as the tab panel content', async () => {
          const user = arbitraryUserDetails();
          const ports: Ports = {
            ...defaultAdapters,
            getGroup: () => O.none,
            getAllEvents: T.of([
              userFollowedEditorialCommunity(user.id, arbitraryGroupId()),
              userFollowedEditorialCommunity(user.id, arbitraryGroupId()),
            ]),
            lookupUserByHandle: () => O.some(user),
          };

          const content = await pipe(
            defaultParams,
            userPage(ports)('followed-groups'),
            contentOf,
            T.map(JSDOM.fragment),
          )();

          const tabPanelContent = content.querySelector('.tab-panel')?.innerHTML;

          expect(tabPanelContent).toContain(informationUnavailable);
        });
      });
    });

    describe('when the user is not following any groups', () => {
      let page: DocumentFragment;

      beforeAll(async () => {
        const adapters: Ports = {
          ...defaultAdapters,
          getGroupsFollowedBy: () => [],
        };
        page = await pipe(
          defaultParams,
          userPage(adapters)('followed-groups'),
          contentOf,
          T.map(JSDOM.fragment),
        )();
      });

      it('shows no list of followed groups', async () => {
        const groupCards = page.querySelectorAll('.group-card');

        expect(groupCards).toHaveLength(0);
      });

      it('shows a message saying the user is not following any groups', async () => {
        const message = page.querySelector('.tab-panel')?.innerHTML;

        expect(message).toContain(followingNothing);
      });
    });
  });

  describe('lists tab', () => {
    it('shows lists as the active tab', async () => {
      const page = await pipe(
        defaultParams,
        userPage(defaultAdapters)('lists'),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const tabHeading = page.querySelector('.tab--active')?.innerHTML;

      expect(tabHeading).toContain('Lists (1)');
    });

    it('uses the user displayname as page title', async () => {
      const userDisplayName = arbitraryString();
      const ports: Ports = {
        ...defaultAdapters,
        lookupUserByHandle: () => O.some({
          ...arbitraryUserDetails(),
          displayName: userDisplayName,
        }),
      };
      const page = await pipe(
        defaultParams,
        userPage(ports)('lists'),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({ title: userDisplayName })));
    });

    it('shows a card linking to the saved-articles list page', async () => {
      const page = await pipe(
        defaultParams,
        userPage(defaultAdapters)('lists'),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const link = page.querySelector('.tab-panel a');

      expect(link?.getAttribute('href')).toBe(`/lists/${listId}`);
    });
  });
});
