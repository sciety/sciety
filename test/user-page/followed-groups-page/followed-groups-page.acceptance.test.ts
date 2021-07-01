import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userFollowedEditorialCommunity, userSavedArticle } from '../../../src/types/domain-events';
import { Page } from '../../../src/types/page';
import { RenderPageError } from '../../../src/types/render-page-error';
import { followingNothing, informationUnavailable } from '../../../src/user-page/static-messages';
import { userPage } from '../../../src/user-page/user-page';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

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

describe('followed-groups-page', () => {
  it('shows groups as the active tab', async () => {
    const ports = {
      getGroup: shouldNotBeCalled,
      getUserDetails: () => TE.right(arbitraryUserDetails),
      getAllEvents: T.of([]),
      fetchArticle: shouldNotBeCalled,
      findReviewsForArticleDoi: shouldNotBeCalled,
      findVersionsForArticleDoi: shouldNotBeCalled,
    };
    const params = { id: arbitraryUserId() };
    const page = await pipe(
      params,
      userPage(ports)('followed-groups'),
      contentOf,
      T.map(JSDOM.fragment),
    )();
    const tabHeading = page.querySelector('.tab--active')?.innerHTML;

    expect(tabHeading).toContain('Followed groups');
  });

  it.todo('shows the articles tab as the inactive tab');

  it('always shows a saved article count in the saved article tab title', async () => {
    const ports = {
      getGroup: shouldNotBeCalled,
      getUserDetails: () => TE.right(arbitraryUserDetails),
      getAllEvents: T.of([]),
      fetchArticle: shouldNotBeCalled,
      findReviewsForArticleDoi: shouldNotBeCalled,
      findVersionsForArticleDoi: shouldNotBeCalled,
    };
    const params = { id: arbitraryUserId() };
    const page = await pipe(
      params,
      userPage(ports)('followed-groups'),
      contentOf,
      T.map(JSDOM.fragment),
    )();
    const tabHeading = page.querySelector('.tab--active')?.innerHTML;

    expect(tabHeading).toContain('(0)');
  });

  describe('page metadata', () => {
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
      };
      const params = { id: arbitraryUserId() };
      const page = await pipe(
        params,
        userPage(ports)('followed-groups'),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({ title: userDisplayName })));
    });

    it('uses the user displayname as the opengraph title', async () => {
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
      };
      const params = { id: arbitraryUserId() };
      const page = await pipe(
        params,
        userPage(ports)('followed-groups'),
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
        getGroup: () => TO.some(arbitraryGroup),
        getUserDetails: () => TE.right(arbitraryUserDetails),
        getAllEvents: T.of([
          userSavedArticle(userId, arbitraryDoi()),
          userFollowedEditorialCommunity(userId, arbitraryGroupId()),
          userFollowedEditorialCommunity(userId, arbitraryGroupId()),
        ]),
        fetchArticle: shouldNotBeCalled,
        findReviewsForArticleDoi: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
      };
      const params = { id: userId };
      const page = await pipe(
        params,
        userPage(ports)('followed-groups'),
      )();

      expect(page).toStrictEqual(E.right(expect.objectContaining({
        openGraph: expect.objectContaining({
          description: '1 saved article | 2 followed groups',
        }),
      })));
    });
  });

  describe('user is following groups', () => {
    it('displays followed groups as group cards', async () => {
      const userId = arbitraryUserId();
      const ports = {
        getGroup: () => TO.some(arbitraryGroup),
        getUserDetails: () => TE.right(arbitraryUserDetails),
        getAllEvents: T.of([
          userFollowedEditorialCommunity(userId, arbitraryGroupId()),
          userFollowedEditorialCommunity(userId, arbitraryGroupId()),
        ]),
        fetchArticle: shouldNotBeCalled,
        findReviewsForArticleDoi: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
      };
      const params = { id: userId };
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
          getGroup: () => TO.none,
          getUserDetails: () => TE.right(arbitraryUserDetails),
          getAllEvents: T.of([
            userFollowedEditorialCommunity(userId, arbitraryGroupId()),
            userFollowedEditorialCommunity(userId, arbitraryGroupId()),
          ]),
          fetchArticle: shouldNotBeCalled,
          findReviewsForArticleDoi: shouldNotBeCalled,
          findVersionsForArticleDoi: shouldNotBeCalled,
        };
        const params = { id: userId };

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
      const userId = arbitraryUserId();
      const ports = {
        getGroup: () => shouldNotBeCalled,
        getUserDetails: () => TE.right(arbitraryUserDetails),
        getAllEvents: T.of([]),
        fetchArticle: shouldNotBeCalled,
        findReviewsForArticleDoi: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
      };
      const params = { id: userId };
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
