import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userFollowedEditorialCommunity, userSavedArticle } from '../../src/types/domain-events';
import { Page } from '../../src/types/page';
import { RenderPageError } from '../../src/types/render-page-error';
import { followingNothing, informationUnavailable } from '../../src/user-page/static-messages';
import { userPage } from '../../src/user-page/user-page';
import {
  arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryUri, arbitraryWord,
} from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const contentOf = (page: TE.TaskEither<RenderPageError, Page>) => pipe(
  page,
  TE.match(
    (errorPage) => errorPage.message,
    (p) => p.content,
  ),
);

const arbitraryUserDetails = {
  avatarUrl: arbitraryUri(),
  displayName: arbitraryString(),
  handle: arbitraryWord(),
};

const arbitraryGroup = {
  id: arbitraryGroupId(),
  name: arbitraryString(),
  avatarPath: arbitraryString(),
  descriptionPath: arbitraryString(),
  shortDescription: arbitraryString(),
};

const defaultPorts = {
  getGroup: () => TO.some(arbitraryGroup),
  getUserDetails: () => TE.right(arbitraryUserDetails),
  getAllEvents: T.of([]),
  fetchArticle: () => TE.right({
    doi: arbitraryDoi(),
    server: 'biorxiv' as const,
    title: arbitrarySanitisedHtmlFragment(),
    authors: [],
  }),
  getUserId: () => TE.right(arbitraryUserId()),
  findReviewsForArticleDoi: () => T.of([]),
  findVersionsForArticleDoi: () => TO.none,
};

describe('user-page', () => {
  describe.each([
    ['saved-articles'],
    ['followed-groups'],
  ])('page tab: %s', (tabName: string) => {
    it('uses the user displayname as page title', async () => {
      const userDisplayName = arbitraryString();
      const ports = {
        ...defaultPorts,
        getUserDetails: () => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: userDisplayName,
          handle: arbitraryWord(),
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
      const ports = {
        ...defaultPorts,
        getUserDetails: () => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
          handle: arbitraryWord(),
        }),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)(tabName),
      )();

      expect(E.isRight(page)).toStrictEqual(true);
    });

    it('uses the user displayname as the opengraph title', async () => {
      const userDisplayName = arbitraryString();
      const ports = {
        ...defaultPorts,
        getUserDetails: () => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: userDisplayName,
          handle: arbitraryWord(),
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

    it('includes the count of saved articles and followed groups in the opengraph description', async () => {
      const userId = arbitraryUserId();
      const ports = {
        ...defaultPorts,
        getUserId: () => TE.right(userId),
        getAllEvents: T.of([
          userSavedArticle(userId, arbitraryDoi()),
          userFollowedEditorialCommunity(userId, arbitraryGroupId()),
          userFollowedEditorialCommunity(userId, arbitraryGroupId()),
        ]),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)(tabName),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({
        openGraph: expect.objectContaining({
          description: '1 saved article | Following 2 groups',
        }),
      })));
    });

    it('shows the user details', async () => {
      const avatarUrl = arbitraryUri();
      const displayName = arbitraryString();
      const handle = arbitraryWord();
      const ports = {
        ...defaultPorts,
        getUserDetails: () => TE.right({
          avatarUrl,
          displayName,
          handle,
        }),
      };
      const params = { handle: arbitraryWord() };

      const pageHtml = await contentOf(userPage(ports)(tabName)(params))();

      expect(pageHtml).toContain(avatarUrl);
      expect(pageHtml).toContain(displayName);
      expect(pageHtml).toContain(handle);
    });

    it('always shows the counts in the tab titles', async () => {
      const userId = arbitraryUserId();
      const ports = {
        ...defaultPorts,
        getUserId: () => TE.right(userId),
        getAllEvents: T.of([userFollowedEditorialCommunity(userId, arbitraryGroupId())]),
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
      const ports = {
        ...defaultPorts,
        getUserId: () => TE.right(arbitraryUserId()),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)('followed-groups'),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const tabHeading = page.querySelector('.tab--active')?.innerHTML;

      expect(tabHeading).toContain('Following');
    });

    describe('user is following groups', () => {
      it('displays followed groups as group cards', async () => {
        const userId = arbitraryUserId();
        const ports = {
          ...defaultPorts,
          getAllEvents: T.of([
            userFollowedEditorialCommunity(userId, arbitraryGroupId()),
            userFollowedEditorialCommunity(userId, arbitraryGroupId()),
          ]),
          getUserId: () => TE.right(userId),
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
          const userId = arbitraryUserId();
          const ports = {
            ...defaultPorts,
            getGroup: () => TO.none,
            getAllEvents: T.of([
              userFollowedEditorialCommunity(userId, arbitraryGroupId()),
              userFollowedEditorialCommunity(userId, arbitraryGroupId()),
            ]),
            getUserId: () => TE.right(userId),
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
        const ports = {
          getGroup: () => shouldNotBeCalled,
          getUserDetails: () => TE.right(arbitraryUserDetails),
          getAllEvents: T.of([]),
          fetchArticle: shouldNotBeCalled,
          findReviewsForArticleDoi: shouldNotBeCalled,
          findVersionsForArticleDoi: shouldNotBeCalled,
          getUserId: () => TE.right(arbitraryUserId()),
        };
        const params = { handle: arbitraryWord() };
        page = await pipe(
          params,
          userPage(ports)('followed-groups'),
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
      const ports = {
        getGroup: shouldNotBeCalled,
        getUserDetails: () => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
          handle: arbitraryWord(),
        }),
        getAllEvents: T.of([]),
        fetchArticle: shouldNotBeCalled,
        findReviewsForArticleDoi: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
        getUserId: () => TE.right(arbitraryUserId()),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)('saved-articles'),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const tabHeading = page.querySelector('.tab--active')?.innerHTML;

      expect(tabHeading).toContain('Lists (1)');
    });

    it('uses the user displayname as page title', async () => {
      const userDisplayName = arbitraryString();
      const ports = {
        getGroup: shouldNotBeCalled,
        getUserDetails: () => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: userDisplayName,
          handle: arbitraryWord(),
        }),
        getAllEvents: T.of([]),
        fetchArticle: shouldNotBeCalled,
        findReviewsForArticleDoi: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
        getUserId: () => TE.right(arbitraryUserId()),
      };
      const params = { handle: arbitraryWord() };
      const page = await pipe(
        params,
        userPage(ports)('saved-articles'),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({ title: userDisplayName })));
    });

    it('shows a link to the saved-articles list page', async () => {
      const params = { handle: arbitraryWord() };

      const page = await pipe(
        params,
        userPage({
          ...defaultPorts,
          getUserDetails: () => TE.right({
            avatarUrl: arbitraryUri(),
            displayName: arbitraryWord(),
            handle: params.handle,
          }),
        })('saved-articles'),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const link = page.querySelector('.tab-panel a');

      expect(link?.getAttribute('href')).toStrictEqual(`/users/${params.handle}/lists/saved-articles`);
      expect(link?.textContent).toStrictEqual('Saved articles');
    });
  });
});
