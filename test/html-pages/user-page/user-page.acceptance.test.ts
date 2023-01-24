import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { groupJoined, userFollowedEditorialCommunity } from '../../../src/domain-events';
import { ListOwnerId } from '../../../src/types/list-owner-id';
import { Page } from '../../../src/types/page';
import { RenderPageError } from '../../../src/types/render-page-error';
import { followingNothing, informationUnavailable } from '../../../src/html-pages/user-page/static-messages';
import { Ports, userPage } from '../../../src/html-pages/user-page/user-page';
import {
  arbitraryDate,
  arbitraryString, arbitraryUri, arbitraryWord,
} from '../../helpers';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const contentOf = (page: TE.TaskEither<RenderPageError, Page>) => pipe(
  page,
  TE.match(
    (errorPage) => errorPage.message,
    (p) => p.content,
  ),
);

const listId = arbitraryListId();

const defaultPorts: Ports = {
  getGroup: () => O.some(arbitraryGroup()),
  getAllEvents: T.of([]),
  getUserViaHandle: () => O.some(arbitraryUserDetails()),
  selectAllListsOwnedBy: (ownerId: ListOwnerId) => [{
    id: listId,
    ownerId,
    articleIds: [],
    lastUpdated: arbitraryDate(),
    name: arbitraryString(),
    description: arbitraryString(),
  }],
};

describe('user-page', () => {
  describe.each([
    ['lists'],
    ['followed-groups'],
  ])('page tab: %s', (tabName: string) => {
    it('uses the user displayname as page title', async () => {
      const userDisplayName = arbitraryString();
      const ports: Ports = {
        ...defaultPorts,
        getUserViaHandle: () => O.some({
          ...arbitraryUserDetails(),
          displayName: userDisplayName,
        }),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)(tabName),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({ title: userDisplayName })));
    });

    it('accepts handle as a string', async () => {
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(defaultPorts)(tabName),
      )();

      expect(E.isRight(page)).toBe(true);
    });

    it('uses the user displayname as the opengraph title', async () => {
      const userDisplayName = arbitraryString();
      const ports: Ports = {
        ...defaultPorts,
        getUserViaHandle: () => O.some({
          ...arbitraryUserDetails(),
          displayName: userDisplayName,
        }),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)(tabName),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({
        openGraph: expect.objectContaining({
          title: userDisplayName,
        }),
      })));
    });

    it('includes the count of lists and followed groups in the opengraph description', async () => {
      const user = arbitraryUserDetails();
      const ports: Ports = {
        ...defaultPorts,
        getUserViaHandle: () => O.some(user),
        getAllEvents: T.of([
          userFollowedEditorialCommunity(user.id, arbitraryGroupId()),
          userFollowedEditorialCommunity(user.id, arbitraryGroupId()),
        ]),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)(tabName),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({
        openGraph: expect.objectContaining({
          description: '1 list | Following 2 groups',
        }),
      })));
    });

    it('shows the user details', async () => {
      const avatarUrl = arbitraryUri();
      const displayName = arbitraryString();
      const handle = arbitraryWord();
      const ports: Ports = {
        ...defaultPorts,
        getUserViaHandle: () => O.some({
          avatarUrl,
          displayName,
          handle,
          id: arbitraryUserId(),
        }),
      };
      const params = { handle: arbitraryWord() };

      const pageHtml = await contentOf(userPage(ports)(tabName)(params))();

      expect(pageHtml).toContain(avatarUrl);
      expect(pageHtml).toContain(displayName);
      expect(pageHtml).toContain(handle);
    });

    it('always shows the counts in the tab titles', async () => {
      const user = arbitraryUserDetails();
      const ports: Ports = {
        ...defaultPorts,
        getUserViaHandle: () => O.some(user),
        getAllEvents: T.of([userFollowedEditorialCommunity(user.id, arbitraryGroupId())]),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)(tabName),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const tabHeadings = page.querySelectorAll('.tab');
      const headings = Array.from(tabHeadings).map((tab) => tab.innerHTML);

      expect(headings[0]).toContain('Lists (1)');
      expect(headings[1]).toContain('Following (1)');
    });
  });

  describe('followed-groups tab', () => {
    it('shows groups as the active tab', async () => {
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(defaultPorts)('followed-groups'),
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
          ...defaultPorts,
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
          getUserViaHandle: () => O.some(user),
        };
        const params = { handle: arbitraryWord() };
        const page = await pipe(
          params,
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
            ...defaultPorts,
            getGroup: () => O.none,
            getAllEvents: T.of([
              userFollowedEditorialCommunity(user.id, arbitraryGroupId()),
              userFollowedEditorialCommunity(user.id, arbitraryGroupId()),
            ]),
            getUserViaHandle: () => O.some(user),
          };
          const params = { handle: arbitraryWord() };

          const content = await pipe(
            params,
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
        const params = { handle: arbitraryWord() };
        page = await pipe(
          params,
          userPage(defaultPorts)('followed-groups'),
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
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(defaultPorts)('lists'),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const tabHeading = page.querySelector('.tab--active')?.innerHTML;

      expect(tabHeading).toContain('Lists (1)');
    });

    it('uses the user displayname as page title', async () => {
      const userDisplayName = arbitraryString();
      const ports: Ports = {
        ...defaultPorts,
        getUserViaHandle: () => O.some({
          ...arbitraryUserDetails(),
          displayName: userDisplayName,
        }),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)('lists'),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({ title: userDisplayName })));
    });

    it('shows a card linking to the saved-articles list page', async () => {
      const params = { handle: arbitraryWord() };

      const page = await pipe(
        params,
        userPage({
          ...defaultPorts,
          getUserViaHandle: () => O.some({
            ...arbitraryUserDetails(),
            handle: params.handle,
          }),
        })('lists'),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const link = page.querySelector('.tab-panel a');

      expect(link?.getAttribute('href')).toBe(`/lists/${listId}`);
    });
  });
});
