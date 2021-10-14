import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import {
  groupEvaluatedArticle, userFollowedEditorialCommunity,
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

  const defaultPorts = {
    getUserDetails,
    getGroup: () => TE.right(arbitraryGroup()),
    fetchArticle: () => TE.right({
      doi: arbitraryDoi(),
      title: arbitraryHtmlFragment(),
      authors: [],
    }),
  };

  it('renders collapsed single article evaluated events as a single card', async () => {
    const groupId = arbitraryGroupId();
    const articleId = arbitraryDoi();
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupEvaluatedArticle(groupId, articleId, arbitraryReviewId()),
        groupEvaluatedArticle(groupId, articleId, arbitraryReviewId()),
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
    const groupId = arbitraryGroupId();
    const ports = {
      ...defaultPorts,
      getAllEvents: T.of([
        groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
        groupEvaluatedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
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
        groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
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
        userFollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId()),
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
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
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
        groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
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

    expect(itemCount).toStrictEqual(1);
  });
});
