import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import {
  articleAddedToList,
  groupJoined, listCreated, userFollowedEditorialCommunity,
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
  userSavedArticle,
  userUnfollowedEditorialCommunity,
  userUnsavedArticle,
} from '../../src/domain-events';
import { scietyFeedPage } from '../../src/sciety-feed-page/sciety-feed-page';
import * as LOID from '../../src/types/list-owner-id';
import {
  arbitraryHtmlFragment, arbitraryString, arbitraryUri, arbitraryWord,
} from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('sciety-feed-page', () => {
  const getUserDetails = () => TE.right({
    handle: arbitraryWord(),
    avatarUrl: arbitraryUri(),
  });

  const group = arbitraryGroup();

  const defaultPorts = {
    getUserDetails,
    fetchArticle: () => TE.right({
      doi: arbitraryDoi(),
      title: arbitraryHtmlFragment(),
      authors: O.none,
    }),
  };

  it('renders a single saved article as a card', async () => {
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        userSavedArticle(arbitraryUserId(), arbitraryArticleId()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)(20)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain('saved an article to a list');
  });

  it('renders a single user followed editorial community as a card', async () => {
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupJoined(group),
        userFollowedEditorialCommunity(arbitraryUserId(), group.id),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)(20)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain('followed a group');
  });

  it('renders at most a page of cards at a time', async () => {
    const events = [
      groupJoined(group),
      userFollowedEditorialCommunity(arbitraryUserId(), group.id),
      userFollowedEditorialCommunity(arbitraryUserId(), group.id),
      userFollowedEditorialCommunity(arbitraryUserId(), group.id),
    ];
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of(events),
    };
    const pageSize = events.length - 1;
    const renderedPage = await pipe(
      scietyFeedPage(ports)(pageSize)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();
    const html = JSDOM.fragment(renderedPage);
    const itemCount = Array.from(html.querySelectorAll('.sciety-feed-card')).length;

    expect(itemCount).toStrictEqual(pageSize);
  });

  it('does not render non-feed events', async () => {
    const listId = arbitraryListId();
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupJoined(group),
        listCreated(listId, arbitraryString(), arbitraryString(), LOID.fromGroupId(group.id)),
        articleAddedToList(arbitraryArticleId(), listId),
        userUnsavedArticle(arbitraryUserId(), arbitraryArticleId()),
        userUnfollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId()),
        userFoundReviewHelpful(arbitraryUserId(), arbitraryReviewId()),
        userFoundReviewNotHelpful(arbitraryUserId(), arbitraryReviewId()),
        userRevokedFindingReviewHelpful(arbitraryUserId(), arbitraryReviewId()),
        userRevokedFindingReviewNotHelpful(arbitraryUserId(), arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)(10)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();
    const html = JSDOM.fragment(renderedPage);
    const itemCount = Array.from(html.querySelectorAll('.sciety-feed-card')).length;

    expect(itemCount).toBe(1);
  });
});
