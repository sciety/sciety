import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import {
  evaluationRecorded,
  groupCreated, userFollowedEditorialCommunity,
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
  userSavedArticle,
  userUnfollowedEditorialCommunity,
  userUnsavedArticle,
} from '../../src/domain-events';
import { scietyFeedPage } from '../../src/sciety-feed-page/sciety-feed-page';
import {
  arbitraryHtmlFragment, arbitraryUri, arbitraryWord,
} from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryGroup } from '../types/group.helper';
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

  it('renders collapsed single article evaluated events as a single card', async () => {
    const articleId = arbitraryDoi();
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupCreated(group),
        evaluationRecorded(group.id, articleId, arbitraryReviewId()),
        evaluationRecorded(group.id, articleId, arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)(20)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain('evaluated an article');
  });

  it('renders collapsed multiple article evaluated events as a single card', async () => {
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupCreated(group),
        evaluationRecorded(group.id, arbitraryDoi(), arbitraryReviewId()),
        evaluationRecorded(group.id, arbitraryDoi(), arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)(20)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain('evaluated 2 articles');
  });

  it('renders a single evaluation as a card', async () => {
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupCreated(group),
        evaluationRecorded(group.id, arbitraryDoi(), arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)(20)({ page: 1 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain('evaluated an article');
  });

  it('renders a single saved article as a card', async () => {
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        userSavedArticle(arbitraryUserId(), arbitraryDoi()),
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
        groupCreated(group),
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
      groupCreated(group),
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
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupCreated(group),
        evaluationRecorded(group.id, arbitraryDoi(), arbitraryReviewId()),
        userUnsavedArticle(arbitraryUserId(), arbitraryDoi()),
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
