import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import {
  groupEvaluatedArticle,
  userFollowedEditorialCommunity,
  userFoundReviewHelpful,
  userFoundReviewNotHelpful,
  userRevokedFindingReviewHelpful,
  userRevokedFindingReviewNotHelpful,
  userSavedArticle,
  userUnfollowedEditorialCommunity,
  userUnsavedArticle,
} from '../../src/domain-events';
import { scietyFeedPage } from '../../src/sciety-feed-page/sciety-feed-page';
import { arbitraryHtmlFragment } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('sciety-feed-page', () => {
  it('renders collapsed single article evaluated events as a single card', async () => {
    const group = arbitraryGroup();
    const articleId = arbitraryDoi();
    const articleTitle = arbitraryHtmlFragment();
    const ports = {
      fetchArticle: () => TE.right({
        doi: arbitraryDoi(),
        title: articleTitle,
        authors: [],
      }),
      getGroup: () => TO.some(group),
      getAllEvents: T.of([
        groupEvaluatedArticle(group.id, articleId, arbitraryReviewId()),
        groupEvaluatedArticle(group.id, articleId, arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)({ page: 1, pageSize: 20 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain(`${group.name} evaluated an article`);
    expect(renderedPage).toContain(articleTitle);
  });

  it('renders collapsed multiple article evaluated events as a single card', async () => {
    const group = arbitraryGroup();
    const ports = {
      fetchArticle: () => TE.right({
        doi: arbitraryDoi(),
        title: arbitraryHtmlFragment(),
        authors: [],
      }),
      getGroup: () => TO.some(group),
      getAllEvents: T.of([
        groupEvaluatedArticle(group.id, arbitraryDoi(), arbitraryReviewId()),
        groupEvaluatedArticle(group.id, arbitraryDoi(), arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)({ page: 1, pageSize: 20 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain(`${group.name} evaluated 2 articles`);
  });

  it('renders a single evaluation as a card', async () => {
    const group = arbitraryGroup();
    const articleId = arbitraryDoi();
    const ports = {
      fetchArticle: () => TE.right({
        doi: arbitraryDoi(),
        title: arbitraryHtmlFragment(),
        authors: [],
      }),
      getGroup: () => TO.some(group),
      getAllEvents: T.of([
        groupEvaluatedArticle(group.id, articleId, arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)({ page: 1, pageSize: 20 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain(`${group.name} evaluated an article`);
  });

  it.skip('renders a single saved article as a card', async () => {
    const ports = {
      fetchArticle: shouldNotBeCalled,
      getGroup: shouldNotBeCalled,
      getAllEvents: T.of([
        userSavedArticle(arbitraryUserId(), arbitraryDoi()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)({ page: 1, pageSize: 20 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();

    expect(renderedPage).toContain('saved an article to a list');
  });

  it('renders at most a page of cards at a time', async () => {
    const events = [
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
    ];
    const ports = {
      fetchArticle: () => TE.right({
        doi: arbitraryDoi(),
        title: arbitraryHtmlFragment(),
        authors: [],
      }),
      getGroup: () => TO.some(arbitraryGroup()),
      getAllEvents: T.of(events),
    };
    const pageSize = events.length - 1;
    const renderedPage = await pipe(
      scietyFeedPage(ports)({ page: 1, pageSize }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();
    const html = JSDOM.fragment(renderedPage);
    const itemCount = Array.from(html.querySelectorAll('.sciety-feed-card')).length;

    expect(itemCount).toStrictEqual(pageSize);
  });

  it('does not render non-feed events', async () => {
    const ports = {
      fetchArticle: () => TE.right({
        doi: arbitraryDoi(),
        title: arbitraryHtmlFragment(),
        authors: [],
      }),
      getGroup: () => TO.some(arbitraryGroup()),
      getAllEvents: T.of([
        groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
        userSavedArticle(arbitraryUserId(), arbitraryDoi()),
        userUnsavedArticle(arbitraryUserId(), arbitraryDoi()),
        userFollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId()),
        userUnfollowedEditorialCommunity(arbitraryUserId(), arbitraryGroupId()),
        userFoundReviewHelpful(arbitraryUserId(), arbitraryReviewId()),
        userFoundReviewNotHelpful(arbitraryUserId(), arbitraryReviewId()),
        userRevokedFindingReviewHelpful(arbitraryUserId(), arbitraryReviewId()),
        userRevokedFindingReviewNotHelpful(arbitraryUserId(), arbitraryReviewId()),
      ]),
    };
    const renderedPage = await pipe(
      scietyFeedPage(ports)({ page: 1, pageSize: 10 }),
      T.map(E.getOrElseW(shouldNotBeCalled)),
      T.map((page) => page.content),
    )();
    const html = JSDOM.fragment(renderedPage);
    const itemCount = Array.from(html.querySelectorAll('.sciety-feed-card')).length;

    expect(itemCount).toStrictEqual(1);
  });
});
